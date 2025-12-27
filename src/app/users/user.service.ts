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

  fetchUsers(){
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

  deleteUser(id:number){
    const prev = this._users();
    this._users.set(prev.filter(u => u.id !== id));

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(err =>{
        //rollback

        this._users.set(prev);
        this.error.set("delete failed");
        return of(null);
      })
    );
  }

}
