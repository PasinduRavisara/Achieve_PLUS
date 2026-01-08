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
  // In a real app, this would use a chart library like ng2-charts or echarts
  // For now, we will use CSS-based visualizations for the "flashy" effect
}
