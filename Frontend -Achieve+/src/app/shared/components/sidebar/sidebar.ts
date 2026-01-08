import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() role: 'admin' | 'employee' = 'employee';
  
  authService = inject(AuthService);

  get menuItems() {
    if (this.role === 'admin') {
      return [
        { label: 'Dashboard', icon: 'bi-grid-fill', route: '/admin/dashboard' },
        { label: 'Task Management', icon: 'bi-kanban', route: '/admin/tasks' },
        { label: 'Progress Analysis', icon: 'bi-graph-up-arrow', route: '/admin/progress-analysis' },
        { label: 'Reward Store', icon: 'bi-shop', route: '/admin/reward-store' },
        { label: 'Employees', icon: 'bi-people-fill', route: '/admin/employees' },
        { label: 'Leaderboard', icon: 'bi-trophy-fill', route: '/admin/leaderboard' },
      ];
    } else {
      return [
        { label: 'Dashboard', icon: 'bi-grid-fill', route: '/dashboard' },
        { label: 'My Tasks', icon: 'bi-list-check', route: '/dashboard/tasks' },
        { label: 'Progress', icon: 'bi-bar-chart-fill', route: '/dashboard/progress' },
        { label: 'Achievements', icon: 'bi-award-fill', route: '/dashboard/rewards' },
        { label: 'Store', icon: 'bi-bag-fill', route: '/dashboard/store' },
        { label: 'Wellness', icon: 'bi-heart-pulse-fill', route: '/dashboard/wellness' },
        { label: 'Leaderboard', icon: 'bi-trophy-fill', route: '/dashboard/leaderboard' },
      ];
    }
  }

  logout() {
    this.authService.logout();
  }
}
