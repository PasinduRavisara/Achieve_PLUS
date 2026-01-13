import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserDTO } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-admin-employees-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-employees-details.html',
  styleUrl: './admin-employees-details.css',
})
export class AdminEmployeesDetails {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  employees: any[] = [];
  showAddModal = false;
  newEmployee = {
      fullName: '',
      email: '',
      password: '',
      role: 'ROLE_EMPLOYEE'
  };

  /* Search Logic */
  currentSearchQuery = '';

  constructor() {}

  ngOnInit() {
    this.refreshEmployees();
  }

  get filteredEmployees() {
      if (!this.currentSearchQuery) return this.employees;
      const q = this.currentSearchQuery.toLowerCase();
      return this.employees.filter(e => 
          e.name.toLowerCase().includes(q) || 
          e.email.toLowerCase().includes(q)
      );
  }

  refreshEmployees() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.employees = users.map(u => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          role: u.role,
          joinDate: u.joinDate || '2026-01-01', 
          status: u.status || 'active', 
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`
        }));
        this.cdr.detectChanges();
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

  openAddModal() {
      this.showAddModal = true;
      this.newEmployee = { fullName: '', email: '', password: '', role: 'ROLE_EMPLOYEE' };
  }
  
  closeAddModal() {
      this.showAddModal = false;
  }
  
  saveEmployee() {
      if(!this.newEmployee.fullName || !this.newEmployee.email || !this.newEmployee.password) return;
      this.authService.register(this.newEmployee).subscribe({
          next: () => {
              this.refreshEmployees();
              this.closeAddModal();
          },
          error: (err) => console.error('Create failed', err)
      });
  }
}
