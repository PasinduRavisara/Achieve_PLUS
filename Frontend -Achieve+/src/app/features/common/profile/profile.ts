import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  authService = inject(AuthService);
  isEditing = false;
  
  user = {
    name: this.authService.currentUser()?.name || 'User',
    email: this.authService.currentUser()?.email || 'user@example.com',
    role: this.authService.currentUser()?.role || 'employee',
    bio: 'Web Developer passionate about building great user experiences.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  };

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    this.isEditing = false;
    // Logic to save profile would go here
  }
}
