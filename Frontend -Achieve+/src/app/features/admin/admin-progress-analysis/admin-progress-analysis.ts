import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-admin-progress-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-progress-analysis.html',
  styleUrl: './admin-progress-analysis.css',
})
export class AdminProgressAnalysis {
  timeframe = 'Last Month';
  employeeFilter = 'All Employees';

  stats = {
    totalTasks: 0,
    completedTasks: 0,
    pointsEarned: 0,
    overdueTasks: 0
  };

  timelineData = [0, 0, 0, 0, 0, 0, 0];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.taskService.getAdminStats().subscribe({
      next: (data) => {
        if (data) {
          this.stats.totalTasks = data.totalTasks || 0;
          this.stats.completedTasks = data.completedTasks || 0;
          this.stats.pointsEarned = data.totalPoints || 0;
          this.stats.overdueTasks = data.overdueTasks || 0;
          // If backend provides timeline (weekly activity?)
          if (data.timeline) {
            this.timelineData = data.timeline;
          }
        }
      },
      error: (err) => console.error('Failed to load admin stats', err)
    });
  }
}
