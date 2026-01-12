import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, TaskDTO } from '../../../core/services/task.service';

@Component({
  selector: 'app-admin-task-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-task-dashboard.html',
  styleUrl: './admin-task-dashboard.css',
})
export class AdminTaskDashboard {
  activeTab = 'all';
  tasks: TaskDTO[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.refreshTasks();
  }

  get filteredTasks() {
    if (this.activeTab === 'all') return this.tasks;
    // Backend returns "Pending", "In Progress", "Completed" usually
    // Mapping tabs to status
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'inprogress': 'In Progress',
      'completed': 'Completed'
    };
    return this.tasks.filter(t => t.status === statusMap[this.activeTab] || t.status === this.activeTab);
  }

  get pendingCount() { return this.tasks.filter(t => t.status === 'Pending').length; }
  get inProgressCount() { return this.tasks.filter(t => t.status === 'In Progress').length; }
  get completedCount() { return this.tasks.filter(t => t.status === 'Completed').length; }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  getPriorityClass(priority: string | undefined): string {
    if (!priority) return '';
    switch(priority.toLowerCase()) {
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-inprogress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  }

  refreshTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Failed to load admin tasks', err)
    });
  }
}
