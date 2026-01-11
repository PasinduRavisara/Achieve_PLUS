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
  activeTab = 'All';

  tasks = [
    { id: 1, title: 'Complete onboarding documentation', description: 'Read and sign all HR documents.', status: 'Pending', priority: 'High', due: '2026-01-15' },
    { id: 2, title: 'Review project guidelines', description: 'Understand coding standards and workflow.', status: 'In Progress', priority: 'Medium', due: '2026-01-20' },
    { id: 3, title: 'Set up development environment', description: 'Install VS Code, Node.js, and dependencies.', status: 'Completed', priority: 'High', due: '2026-01-10' },
  ];

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
    // Simulating refresh
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
