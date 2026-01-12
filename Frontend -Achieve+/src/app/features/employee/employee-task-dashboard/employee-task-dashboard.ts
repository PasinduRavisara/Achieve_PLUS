import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-employee-task-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-task-dashboard.html',
  styleUrl: './employee-task-dashboard.css',
})
export class EmployeeTaskDashboard {
  activeTab = 'All';
  tasks: any[] = []; // Changed to any[] to match service DTO flexible

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.refresh();
  }

  get filteredTasks() {
    if (this.activeTab === 'All') return this.tasks;
    return this.tasks.filter(t => t.status === this.activeTab);
  }

  get stats() {
    return {
      all: this.tasks.length,
      pending: this.tasks.filter(t => t.status === 'Pending').length,
      inProgress: this.tasks.filter(t => t.status === 'In Progress').length,
      completed: this.tasks.filter(t => t.status === 'Completed').length,
    };
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  refresh() {
    this.taskService.getMyTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Completed': return 'bg-green';
      case 'In Progress': return 'bg-blue';
      case 'Pending': return 'bg-yellow';
      default: return 'bg-gray';
    }
  }
}
