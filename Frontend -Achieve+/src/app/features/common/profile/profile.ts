import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  authService = inject(AuthService);
  userService = inject(UserService);
  isEditing = false;
  
  user = {
    id: 0,
    name: '',
    userName: '',
    email: '',
    role: '',
    bio: 'Web Developer passionate about building great user experiences.', // Placeholder/Local
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
    points: 0
  };

  ngOnInit() {
    this.refreshUser();
  }

  refreshUser() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.userService.getUserById(currentUser.id).subscribe({
        next: (u) => {
          this.user = {
            id: u.id,
            name: u.fullName,
            userName: u.userName,
            email: u.email,
            role: u.role,
            bio: this.user.bio, // Preserve local
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`,
            points: u.points
          };
        },
        error: (err) => console.error('Failed to load profile', err)
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    if (this.user.id) {
       this.userService.updateUser(this.user.id, { 
         fullName: this.user.name,
         userName: this.user.userName,
         email: this.user.email 
       }).subscribe({
         next: (updated) => {
           this.isEditing = false;
           this.refreshUser();
           alert('Profile updated successfully!');
         },
         error: (err) => {
           console.error(err);
           alert(err.error?.message || 'Failed to update profile');
         }
       });
    }
  }

  logout() {
    this.authService.logout();
  }
}
