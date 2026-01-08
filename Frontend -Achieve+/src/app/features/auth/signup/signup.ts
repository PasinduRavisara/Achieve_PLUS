import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [GlassCard],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  private router = inject(Router);

  signup() {
    // Mock signup logic
    this.router.navigate(['/login']);
  }
}
