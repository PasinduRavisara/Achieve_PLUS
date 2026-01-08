import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-progress-analysis',
  standalone: true,
  imports: [CommonModule, GlassCard, NgxChartsModule],
  templateUrl: './progress-analysis.html',
  styleUrl: './progress-analysis.css'
})
export class ProgressAnalysis {
  // Chart Data
  single = [
    { name: "Mon", value: 5 },
    { name: "Tue", value: 8 },
    { name: "Wed", value: 4 },
    { name: "Thu", value: 7 },
    { name: "Fri", value: 12 },
    { name: "Sat", value: 3 },
    { name: "Sun", value: 1 }
  ];

  pieData = [
    { name: "Development", value: 40 },
    { name: "Meetings", value: 20 },
    { name: "Design", value: 30 },
    { name: "Testing", value: 10 }
  ];

  // Options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Day of Week';
  showYAxisLabel = true;
  yAxisLabel = 'Tasks Completed';
  
  colorScheme: Color = {
    domain: ['#5AA9E6', '#7FC8F8', '#F9F9F9', '#FFE45E'],
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal
  };
}
