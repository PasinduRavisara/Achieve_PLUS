import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  
  authService = inject(AuthService);

  onLogin() {
    if (this.email.toLowerCase().includes('admin')) {
      this.authService.login('admin');
    } else {
      this.authService.login('employee');
    }
  }

  loginAs(role: 'admin' | 'employee') {
    this.authService.login(role);
  }
}
