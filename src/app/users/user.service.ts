import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { User } from '../shared/models/user.model';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class UsersService {
  private http = inject(HttpClient);

  // state
  private _users = signal<User[]>([]);
  users = computed(() => this._users());

  loading = signal(false);

  error = signal<string | null>(null);

  private baseUrl = 'https://jsonplaceholder.typicode.com/users';

  createUser(payload: { name: string; email: string }) {
    this.error.set(null);

    // optimistic
    const tempId = Math.floor(Math.random() * 1_000_000) * 1;
    const optimisticUser = { id: tempId, ...payload };


    const prev = this._users();
    this._users.set([optimisticUser, ...prev])

    return this.http.post<any>(this.baseUrl, payload).pipe(
      tap((res) => {
        const newId = res?.id ?? Math.floor(Math.random() * 1_000_000);

        this._users.update((list) =>
          list.map((u) => u.id === tempId ? { ...u, id: newId } : u)
        );
      }),

      catchError((err) => {
        //rollback
        this._users.set(prev);
        this.error.set("created failed");
        return of(null);
      })
    );
  }

  updateUser(id: number, payload: { name: string, email: string }) {
    this.error.set(null);

    const prev = this._users();

    this._users.update(list =>
      list.map(u => (u.id === id ? { ...u, ...payload } : u))
    );

    return this.http.patch(`${this.baseUrl}/${id}`, payload).pipe(
      catchError(err => {
        this._users.set(prev); //rollback
        this.error.set("update failed");
        return of(null)
      })
    );
  }

  fetchUsers() {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<any[]>(this.baseUrl).pipe(
      tap((data) => {
        const mapped: User[] = data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
        }));
        this._users.set(mapped)
      }),
      catchError((err) => {
        this.error.set("Failed to load users");
        return of([]);
      }),
      finalize(() => this.loading.set(false))
    );

  }

  // optimistic delete

  deleteUser(id: number) {
    const prev = this._users();
    this._users.set(prev.filter(u => u.id !== id));

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        //rollback

        this._users.set(prev);
        this.error.set("delete failed");
        return of(null);
      })
    );
  }

}
