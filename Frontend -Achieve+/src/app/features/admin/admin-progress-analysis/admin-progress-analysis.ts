import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    totalTasks: 124,
    completedTasks: 98,
    pointsEarned: 15400,
    overdueTasks: 12
  };

  // Mock data for timelines (last 7 points)
  timelineData = [10, 25, 18, 30, 45, 35, 50];

  refresh() {
    console.log('Refreshing analysis...');
  }
}
