import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-employees-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-employees-details.html',
  styleUrl: './admin-employees-details.css',
})
export class AdminEmployeesDetails {
  employees = [
    { id: 1, name: 'John Doe', department: 'Engineering', role: 'Senior Dev', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', role: 'Manager', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
    { id: 3, name: 'Mike Ross', department: 'Legal', role: 'Associate', status: 'Away', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { id: 4, name: 'Rachel Zane', department: 'Legal', role: 'Paralegal', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel' },
    { id: 5, name: 'Harvey Specter', department: 'Management', role: 'Partner', status: 'Busy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harvey' },
    { id: 6, name: 'Louis Litt', department: 'Management', role: 'Partner', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Louis' },
  ];

  getStatusClass(status: string) {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Busy': return 'status-busy';
      case 'Away': return 'status-away';
      default: return '';
    }
  }
}
