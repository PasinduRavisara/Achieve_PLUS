import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-task-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-task-dashboard.html',
  styleUrl: './employee-task-dashboard.css',
})
export class EmployeeTaskDashboard {
  tasks = [
    { id: 101, title: 'Fix Login Bug', description: 'User unable to login with special characters', status: 'In Progress', priority: 'High', due: 'Today' },
    { id: 102, title: 'Write Unit Tests', description: 'Cover Auth service with tests', status: 'To Do', priority: 'Medium', due: 'Tomorrow' },
    { id: 103, title: 'Update Profile Page', description: 'Add bio field', status: 'Done', priority: 'Low', due: 'Yesterday' }
  ];

  getStatusClass(status: string) {
    if (status === 'Done') return 'status-done';
    if (status === 'In Progress') return 'status-inprogress';
    return 'status-todo';
  }
}
