import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  today = new Date();
  
  stats = [
    { label: 'Total Tasks', value: 0, trend: '', icon: 'bi-list-task', color: 'blue' },
    { label: 'Team Members', value: 0, trend: '', icon: 'bi-people-fill', color: 'green' },
    { label: 'In Progress', value: 0, trend: '', icon: 'bi-arrow-repeat', color: 'cyan' },
    { label: 'Points Earned', value: 0, trend: '', icon: 'bi-check-circle-fill', color: 'yellow' }
  ];

  taskOverview = {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  };

  quickLinks = [
    { title: 'Task Management', desc: 'Create, assign, and track tasks', icon: 'bi-list-ul', route: '/admin/tasks', color: 'var(--primary)' },
    { title: 'Employee Management', desc: 'Manage profiles and roles', icon: 'bi-people', route: '/admin/employees', color: '#00ff88' },
    { title: 'Progress Analysis', desc: 'View detailed analytics', icon: 'bi-graph-up', route: '/admin/progress-analysis', color: 'var(--secondary)' },
    { title: 'Leaderboard', desc: 'View top performers', icon: 'bi-trophy', route: '/admin/leaderboard', color: '#ffd700' }
  ];

  reminders: any[] = []; 

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.refreshDashboard();
  }

  refreshDashboard() {
    this.taskService.getAdminStats().subscribe({
      next: (data) => {
        if (data) {
          // Update Overview
           this.taskOverview.total = data.totalTasks || 0;
           this.taskOverview.completed = data.completedTasks || 0;
           this.taskOverview.inProgress = data.inProgressTasks || 0;
           this.taskOverview.pending = data.pendingTasks || 0; // Assuming backend sends this

           // Update Stats Cards
           this.stats[0].value = this.taskOverview.total; // Total Tasks
           this.stats[1].value = data.totalUsers || 0; // Team Members (assuming backend sends this or 0)
           this.stats[2].value = this.taskOverview.inProgress; // In Progress
           this.stats[3].value = data.totalPoints || 0; // Points Earned
           this.stats[3].label = 'Points Earned'; // Changed label from Completion Rate to match likely data
        }
      },
      error: (err) => console.error('Failed to load dashboard stats', err)
    });
  }

  addReminder() {
    const text = prompt("Enter reminder:");
    if (text) this.reminders.push({ text, date: new Date() });
  }
}
