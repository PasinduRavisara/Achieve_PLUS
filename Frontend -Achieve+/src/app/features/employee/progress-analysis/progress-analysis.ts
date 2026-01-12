import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-progress-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-analysis.html',
  styleUrl: './progress-analysis.css',
})
export class ProgressAnalysis {
  // Stats for Cards
  stats = {
    completed: 0,
    inProgress: 0,
    overdue: 0,
    points: 0
  };

  completionRate = 0; // Percentage for Doughnut

  // Chart Data
  weeklyActivity = [0, 0, 0, 0, 0, 0, 0]; // Default

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.taskService.getMyStats().subscribe({
      next: (data) => {
        // Assume backend returns map matching these keys or map manually
        if (data) {
           this.stats.completed = data.completed || 0;
           this.stats.inProgress = data.inProgress || 0;
           this.stats.overdue = data.overdue || 0;
           this.stats.points = data.points || 0;
           
           const total = this.stats.completed + this.stats.inProgress + this.stats.overdue;
           this.completionRate = total > 0 ? Math.round((this.stats.completed / total) * 100) : 0;
        }
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }
}
