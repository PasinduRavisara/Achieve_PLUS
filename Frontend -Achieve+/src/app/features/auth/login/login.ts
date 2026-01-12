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
    this.authService.login(this.email, this.password).subscribe({
      error: (err) => {
        console.error('Login failed', err);
        alert('Login failed. Please check credentials.');
      }
    });
  }

  // Removed mocked loginAs method to enforce real data usage

}
