import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}


type AuthUser = {email: string}
type LoginResponse = { token: string; user: { email: string } };

@Injectable({providedIn: 'root'})




export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'token';

  

  // auth state (signals)
  user = signal<AuthUser | null>(null);
  isAuthenticated = signal<boolean>(false);

  

  initFromStorage() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return;

    const payload = decodeJwtPayload(token);
    const email = payload?.email;

    if (email) {
      this.isAuthenticated.set(true);
      this.user.set({ email });
    } else {
      
      this.logout();
    }
  }




login(email: string, password: string) {
  return this.http
    .post<LoginResponse>('/api/auth/login', { email, password })
    .pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.isAuthenticated.set(true);
        this.user.set(res.user);
      })
    );
}


  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.user.set(null)
  }

}

