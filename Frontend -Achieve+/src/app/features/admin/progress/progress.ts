import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-progress',
  standalone: true,
  imports: [CommonModule, GlassCard, NgxChartsModule],
  templateUrl: './progress.html',
  styleUrl: './progress.css'
})
export class Progress {
  // Aggregate Data
  teamVelocity = [
    { name: "Week 1", value: 45 },
    { name: "Week 2", value: 52 },
    { name: "Week 3", value: 48 },
    { name: "Week 4", value: 61 }
  ];

  deptPerformance = [
    { name: "Engineering", value: 85 },
    { name: "Design", value: 72 },
    { name: "Product", value: 90 },
    { name: "Marketing", value: 65 }
  ];

  // Options
  colorScheme: Color = {
    domain: ['#5AA9E6', '#7FC8F8', '#F9F9F9', '#FFE45E'],
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal
  };
}
