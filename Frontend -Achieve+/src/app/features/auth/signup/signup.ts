import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  emailExistsError: string | null = null;
  passwordMismatchError: string | null = null;
  
  private cdr = inject(ChangeDetectorRef);

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    this.emailExistsError = null;
    this.passwordMismatchError = null;
    
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) return;

    if (this.password !== this.confirmPassword) {
      this.passwordMismatchError = 'Passwords do not match!';
      return;
    }

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: 'Employee'
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Signup failed', err);
        if (err.error && err.error.message === 'Email already in use') {
            this.emailExistsError = 'Email is already taken';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
