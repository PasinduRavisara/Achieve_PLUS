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
      confirmPassword: '',
      role: 'Employee'
  };

  /* Search & Sort Logic */
  currentSearchQuery = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor() {}

// ... (ngOnInit remains the same)
  ngOnInit() {
    this.refreshEmployees();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get filteredEmployees() {
      let filtered = this.employees;
      
      // Filter
      if (this.currentSearchQuery) {
          const q = this.currentSearchQuery.toLowerCase();
          filtered = filtered.filter(e => 
              e.name.toLowerCase().includes(q) || 
              e.email.toLowerCase().includes(q)
          );
      }

      // Sort
      if (this.sortColumn) {
          filtered = [...filtered].sort((a, b) => { // Sort on a copy
              const valA = a[this.sortColumn];
              const valB = b[this.sortColumn];
              let comparison = 0;

              if (typeof valA === 'string' && typeof valB === 'string') {
                  comparison = valA.localeCompare(valB);
              } else {
                  if (valA < valB) comparison = -1;
                  else if (valA > valB) comparison = 1;
              }

              return this.sortDirection === 'asc' ? comparison : -comparison;
          });
      }

      return filtered;
  }

  /* User Detail Modal Logic */
  selectedUser: any | null = null; // Holds the user to show in the modal

  viewUser(emp: any) {
      this.selectedUser = emp;
  }

  closeUserModal() {
      this.selectedUser = null;
  }

  refreshEmployees() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.employees = users.map(u => ({
          id: u.id,
          name: u.fullName,
          userName: u.userName, // Added this field
          email: u.email,
          role: u.role,
          points: u.points || 0,
          joinDate: u.createdAt || '2026-01-01', 
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

  /* State for error messages */
  passwordMismatchError: string | null = null;
  emailExistsError: string | null = null;
  emailInvalidError: string | null = null;
  formSubmitted: boolean = false;

  openAddModal() {
      this.showAddModal = true;
      this.passwordMismatchError = null;
      this.emailExistsError = null;
      this.emailInvalidError = null;
      this.formSubmitted = false;
      this.newEmployee = { fullName: '', email: '', password: '', confirmPassword: '', role: 'Employee' };
  }
  
  closeAddModal() {
      this.showAddModal = false;
  }
  
  saveEmployee() {
      this.formSubmitted = true;
      this.passwordMismatchError = null;
      this.emailExistsError = null;
      this.emailInvalidError = null;

      if(!this.newEmployee.fullName || !this.newEmployee.email || !this.newEmployee.password || !this.newEmployee.confirmPassword) {
        return;
      }

      // Email Validation
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.newEmployee.email)) {
          this.emailInvalidError = "Invalid email format";
          return;
      }
      
      if (this.newEmployee.password !== this.newEmployee.confirmPassword) {
        this.passwordMismatchError = "Passwords do not match!";
        return;
      }

      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...employeeData } = this.newEmployee;

      this.authService.register(employeeData).subscribe({
          next: () => {
              this.refreshEmployees();
              this.closeAddModal();
          },
          error: (err) => {
              console.error('Create failed', err);
              if (err.error && err.error.message === 'Email already in use') {
                  this.emailExistsError = 'Email is already taken';
              } else {
                  // Handle other errors if needed
              }
              this.cdr.detectChanges();
          }
      });
  }
  /* Delete Logic */
  showDeleteModal = false;
  userToDeleteId: number | null = null;
  userToDeleteName: string = '';
  isDeleting = false;

  initiateDelete(emp: any) {
      if (emp.role === 'Admin' && emp.name === 'pasindu') { 
          alert("Cannot delete the main admin.");
          return;
      }
      this.userToDeleteId = emp.id;
      this.userToDeleteName = emp.name;
      this.showDeleteModal = true;
      this.cdr.detectChanges();
  }

  cancelDelete() {
      if (this.isDeleting) return; // Prevent closing while deleting
      this.showDeleteModal = false;
      this.userToDeleteId = null;
  }

  confirmDelete(event?: Event) {
      if(event) event.stopPropagation();
      
      if (this.userToDeleteId && !this.isDeleting) {
          this.isDeleting = true;
          const id = this.userToDeleteId;
          this.userService.deleteUser(id).subscribe({
              next: () => {
                   // Refresh the full list from backend to ensure state consistency
                  this.refreshEmployees(); 
                  this.isDeleting = false;
                  this.showDeleteModal = false;
                  this.userToDeleteId = null;
                  this.cdr.detectChanges();
              },
              error: (err) => {
                  console.error('Failed to delete user', err);
                  alert('Delete failed. Please try again.');
                  this.isDeleting = false;
                  this.cdr.detectChanges();
              }
          });
      }
  }

  deleteEmployee(id: number) {
      // Legacy direct call unused
  }
}
