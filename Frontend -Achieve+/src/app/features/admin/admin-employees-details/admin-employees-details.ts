import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserDTO } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-employees-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-employees-details.html',
  styleUrl: './admin-employees-details.css',
})
export class AdminEmployeesDetails {
  employees: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.refreshEmployees();
  }

  refreshEmployees() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.employees = users.map(u => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          role: u.role,
          joinDate: '2026-01-01', // Default as backend missing field
          status: 'active', // Default
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`
        }));
      },
      error: (err) => console.error('Failed to load employees', err)
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      default: return '';
    }
  }
}
