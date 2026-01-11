import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    completed: 12,
    inProgress: 5,
    overdue: 2,
    points: 2450
  };

  completionRate = 70; // Percentage for Doughnut

  // Chart Data
  weeklyActivity = [2, 5, 3, 8, 6, 4, 7]; // Mon-Sun

  refresh() {
    console.log('Refreshing analytics...');
  }
}
