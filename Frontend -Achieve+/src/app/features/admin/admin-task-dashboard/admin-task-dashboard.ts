import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-task-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-task-dashboard.html',
  styleUrl: './admin-task-dashboard.css',
})
export class AdminTaskDashboard {
  activeTab = 'all';
  
  tasks: Task[] = [
    { id: 1, title: 'Design Homepage', assignee: 'John Doe', priority: 'high', status: 'pending' },
    { id: 2, title: 'Setup Database', assignee: 'Mike Ross', priority: 'medium', status: 'inprogress' },
    { id: 3, title: 'Implement Auth', assignee: 'Jane Smith', priority: 'high', status: 'completed' },
    { id: 4, title: 'API Documentation', assignee: 'Rachel Zane', priority: 'low', status: 'pending' },
    { id: 5, title: 'Initial Project Setup', assignee: 'Harvey Specter', priority: 'high', status: 'completed' }
  ];

  get filteredTasks() {
    if (this.activeTab === 'all') return this.tasks;
    return this.tasks.filter(t => t.status === this.activeTab);
  }

  get pendingCount() { return this.tasks.filter(t => t.status === 'pending').length; }
  get inProgressCount() { return this.tasks.filter(t => t.status === 'inprogress').length; }
  get completedCount() { return this.tasks.filter(t => t.status === 'completed').length; }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'inprogress': return 'status-inprogress';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }

  refreshTasks() {
    // Mock refresh
    console.log('Refreshing tasks...');
  }
}

interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'inprogress' | 'completed';
}
