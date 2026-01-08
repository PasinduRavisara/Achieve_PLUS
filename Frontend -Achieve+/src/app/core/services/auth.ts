import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'employee';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // defaulting to employee for dev convenience, usually null
  private currentUserSubject = new BehaviorSubject<User | null>({
      id: '1',
      name: 'Test Employee',
      role: 'employee' 
  }); 
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  login(role: 'admin' | 'employee') {
    this.currentUserSubject.next({
      id: '1',
      name: role === 'admin' ? 'Admin User' : 'Test Employee',
      role: role
    });
  }

  logout() {
    this.currentUserSubject.next(null);
  }
}
