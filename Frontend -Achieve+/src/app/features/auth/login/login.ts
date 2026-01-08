import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [GlassCard],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  login(role: 'admin' | 'employee') {
    this.authService.login(role);
    this.router.navigate([role === 'admin' ? '/admin-dashboard' : '/dashboard']);
  }
}
