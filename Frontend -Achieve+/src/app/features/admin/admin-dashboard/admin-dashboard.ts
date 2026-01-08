import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
    { label: 'Total Tasks', value: 124, trend: '+12', icon: 'bi-list-task', color: 'blue' },
    { label: 'Team Members', value: 18, trend: '+3', icon: 'bi-people-fill', color: 'green' },
    { label: 'In Progress', value: 42, trend: '-5', icon: 'bi-arrow-repeat', color: 'cyan' },
    { label: 'Completion Rate', value: '87%', trend: '+2%', icon: 'bi-check-circle-fill', color: 'yellow' }
  ];

  quickLinks = [
    { title: 'Task Management', desc: 'Create, assign, and track tasks', icon: 'bi-list-ul', route: '/admin/tasks', color: 'var(--primary)' },
    { title: 'Employee Management', desc: 'Manage profiles and roles', icon: 'bi-people', route: '/admin/employees', color: '#00ff88' },
    { title: 'Progress Analysis', desc: 'View detailed analytics', icon: 'bi-graph-up', route: '/admin/progress-analysis', color: 'var(--secondary)' },
    { title: 'Leaderboard', desc: 'View top performers', icon: 'bi-trophy', route: '/admin/leaderboard', color: '#ffd700' }
  ];

  taskOverview = {
    total: 124,
    completed: 87,
    inProgress: 24,
    pending: 13
  };

  reminders: any[] = []; // Start empty to show empty state

  addReminder() {
    const text = prompt("Enter reminder:");
    if (text) this.reminders.push({ text, date: new Date() });
  }
}
