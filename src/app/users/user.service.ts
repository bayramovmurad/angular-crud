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

  private baseUrl = '/api/users';


  createUser(payload: { name: string; email: string }) {
    this.error.set(null);

    const tempId = -Math.floor(Math.random() * 1_000_000); // update ve delete isleyir temp
    const optimisticUser = { id: tempId, ...payload };

    const prev = this._users();
    this._users.set([optimisticUser, ...prev]);

    return this.http.post<{ id: number; name: string; email: string }>(this.baseUrl, payload).pipe(
      tap((created) => {
        this._users.update((list) =>
          list.map((u) => (u.id === tempId ? created : u))
        );
      }),
      catchError(() => {
        this._users.set(prev);
        this.error.set('Create failed');
        return of(null);
      })
    );
  }


  updateUser(id: number, payload: { name: string; email: string }) {
    this.error.set(null);

    const prev = this._users();

    this._users.update(list =>
      list.map(u => (u.id === id ? { ...u, ...payload } : u))
    );

    return this.http.put<{ id: number; name: string; email: string }>(`${this.baseUrl}/${id}`, payload).pipe(
      tap((updated) => {
        // backend response ilə sync (ən təmiz)
        this._users.update(list => list.map(u => (u.id === id ? updated : u)));
      }),
      catchError(() => {
        this._users.set(prev);
        this.error.set('Update failed');
        return of(null);
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
      catchError(() => {
        this._users.set(prev);
        this.error.set('Delete failed');
        return of(null);
      })
    );
  }


}
