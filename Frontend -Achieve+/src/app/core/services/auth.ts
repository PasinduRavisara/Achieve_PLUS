import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  fullName: string;
  role: string;
  email: string;
  token?: string;
}

interface AuthResponse {
  id: number;
  token: string;
  role: string;
  fullName: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  constructor(private router: Router, private http: HttpClient) {
    const stored = localStorage.getItem('achieve_user');
    if (stored) {
      this._currentUser.set(JSON.parse(stored));
    }
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          const user: User = {
            id: response.id,
            fullName: response.fullName,
            role: (response.role || '').toLowerCase().includes('admin') ? 'admin' : 'employee',
            email: response.email,
            token: response.token
          };
          
          this._currentUser.set(user);
          localStorage.setItem('achieve_user', JSON.stringify(user));
          localStorage.setItem('token', response.token);
          
          if (this.isAdmin()) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }

  logout() {
    this._currentUser.set(null);
    localStorage.removeItem('achieve_user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this._currentUser();
  }

  isAdmin(): boolean {
    const role = this._currentUser()?.role || '';
    return role.toUpperCase().includes('ADMIN');
  }
  
  getCurrentUser() {
    return this._currentUser();
  }
}
