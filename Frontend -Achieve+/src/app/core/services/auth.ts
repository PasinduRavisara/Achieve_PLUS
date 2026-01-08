import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'employee';
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  constructor(private router: Router) {
    const stored = localStorage.getItem('achieve_user');
    if (stored) {
      this._currentUser.set(JSON.parse(stored));
    }
  }

  login(role: 'admin' | 'employee') {
    const user: User = {
      id: '1',
      name: role === 'admin' ? 'Admin User' : 'Pasindu Ravisara',
      role: role,
      email: role === 'admin' ? 'admin@achieve.com' : 'employee@achieve.com'
    };
    this._currentUser.set(user);
    localStorage.setItem('achieve_user', JSON.stringify(user));
    
    // Redirect based on role
    if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  logout() {
    this._currentUser.set(null);
    localStorage.removeItem('achieve_user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this._currentUser();
  }

  isAdmin(): boolean {
    return this._currentUser()?.role === 'admin';
  }
}
