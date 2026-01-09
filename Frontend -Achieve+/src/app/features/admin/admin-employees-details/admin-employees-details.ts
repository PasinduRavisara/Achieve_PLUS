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
    { id: 1, name: 'Ravisara', email: 'ravisara@gmail.com', role: 'Employee', joinDate: '1/9/2026', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravisara' },
    { id: 2, name: 'John Doe', email: 'john@achieve.plus', role: 'Senior Dev', joinDate: '12/11/2025', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { id: 3, name: 'Jane Smith', email: 'jane@achieve.plus', role: 'Manager', joinDate: '5/10/2025', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
    { id: 4, name: 'Mike Ross', email: 'mike@achieve.plus', role: 'Employee', joinDate: '15/9/2025', status: 'inactive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
  ];

  getStatusClass(status: string) {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      default: return '';
    }
  }
}
