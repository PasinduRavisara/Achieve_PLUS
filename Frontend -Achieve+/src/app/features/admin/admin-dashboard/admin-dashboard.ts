import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ReminderService } from '../../../core/services/reminder.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private taskService = inject(TaskService);
  private reminderService = inject(ReminderService);
  private cdr = inject(ChangeDetectorRef);

  today = new Date();
  
  stats = [
    { label: 'Total Tasks', value: 0, trend: '+10%', icon: 'bi-list-task', color: 'blue' },
    { label: 'Team Members', value: 0, trend: '+2 New', icon: 'bi-people-fill', color: 'green' },
    { label: 'In Progress', value: 0, trend: '+5%', icon: 'bi-arrow-repeat', color: 'cyan' },
    { label: 'Points Earned', value: 0, trend: '+15%', icon: 'bi-check-circle-fill', color: 'yellow' }
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
  showReminderModal = false;
  newReminderText = '';
  newReminderDate = '';
  editingReminderId: number | null = null;

  constructor() {}

  ngOnInit() {
    this.refreshDashboard();
    this.loadReminders();
  }

  refreshDashboard() {
    this.taskService.getAdminStats().subscribe({
      next: (data) => {
        if (data) {
           this.taskOverview.total = data.totalTasks || 0;
           this.taskOverview.completed = data.completedTasks || 0;
           this.taskOverview.inProgress = data.inProgressTasks || 0;
           this.taskOverview.pending = data.pendingTasks || 0; 

           this.stats[0].value = this.taskOverview.total; 
           this.stats[0].trend = data.tasksTrend || '';

           this.stats[1].value = data.totalUsers || 0; 
           this.stats[1].trend = data.usersTrend || '';

           this.stats[2].value = this.taskOverview.inProgress; 
           this.stats[2].trend = data.inProgressTrend || '';

           this.stats[3].value = data.totalPoints || 0; 
           this.stats[3].trend = data.pointsTrend || '';
           this.stats[3].label = 'Points Earned'; 
           this.cdr.markForCheck();
        }
      },
      error: (err) => console.error('Failed to load dashboard stats', err)
    });
  }
  
  loadReminders() {
      this.reminderService.getReminders().subscribe({
          next: (data) => {
              this.reminders = data;
              this.cdr.detectChanges(); // Force update
          },
          error: (err) => console.error('Error loading reminders', err)
      });
  }
  addReminder() {
    this.showReminderModal = true;
    this.editingReminderId = null;
    this.newReminderText = '';
    this.newReminderDate = '';
  }
  
  editReminder(rem: any, event: Event) {
      event.stopPropagation();
      this.editingReminderId = rem.id;
      this.newReminderText = rem.text;
      this.newReminderDate = rem.reminderTime || ''; 
      this.showReminderModal = true;
  }
  
  closeReminderModal() {
      this.showReminderModal = false;
  }
  
  saveReminder() {
      if (!this.newReminderText.trim()) return;
      
      if (this.editingReminderId) {
          this.reminderService.updateReminder(this.editingReminderId, this.newReminderText, this.newReminderDate).subscribe(updated => {
             const index = this.reminders.findIndex(r => r.id === updated.id);
             if (index !== -1) this.reminders[index] = updated;
             this.closeReminderModal();
          });
      } else {
          this.reminderService.createReminder(this.newReminderText, this.newReminderDate).subscribe(rem => {
              this.reminders.unshift(rem);
              this.closeReminderModal();
          });
      }
  }
  
  deleteReminder(id: number, event: Event) {
      event.stopPropagation();
      if(confirm('Delete reminder?')) {
          this.reminderService.deleteReminder(id).subscribe(() => {
              this.reminders = this.reminders.filter(r => r.id !== id);
          });
      }
  }
}
