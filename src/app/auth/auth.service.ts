import { Injectable, signal } from '@angular/core';


type AuthUser = {email: string}

@Injectable({providedIn: 'root'})


export class AuthService {
  private readonly TOKEN_KEY = 'token';

  // auth state (signals)
  user = signal<AuthUser | null>(null);
  isAuthenticated = signal<boolean>(false);

  initFormStorage(){
    const token = localStorage.getItem(this.TOKEN_KEY);

    if(token){
      this.isAuthenticated.set(true);
      this.user.set({email: 'murad@demo.com'})
    }
  }

  login(email: string, password:string){
    // FAKE LOGIN

    if(email && password.length >= 6){
      localStorage.setItem(this.TOKEN_KEY, "demo-token");
      this.isAuthenticated.set(true);
      this.user.set({email});
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.user.set(null)
  }

}

