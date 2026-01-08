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
  weeklyTasks = [6, 8, 7, 10, 5, 2]; // Mon-Sat
  totalPoints = 3450;
  tasksCompleted = 42;
  rank = 12;
}
