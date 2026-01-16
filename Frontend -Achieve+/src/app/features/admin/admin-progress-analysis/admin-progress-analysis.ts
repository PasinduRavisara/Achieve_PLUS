import { Component, ChangeDetectorRef } from '@angular/core';
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
    inProgressTasks: 0,
    pendingTasks: 0,
    pointsEarned: 0,
    overdueTasks: 0
  };

  // Pie Chart
  pieStyle = '';

  // Line Chart
  chartPath = '';
  xLabels: string[] = [];
  yAxisLines = [4, 3, 2, 1, 0];
  maxY = 4;

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.processData(tasks);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  processData(tasks: any[]) {
    // 1. Basic Stats
    this.stats.totalTasks = tasks.length;
    this.stats.completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    this.stats.inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    this.stats.pendingTasks = tasks.filter(t => t.status === 'PENDING').length; 
    
    // Points (assuming completed tasks have earned points)
    this.stats.pointsEarned = tasks
        .filter(t => t.status === 'COMPLETED')
        .reduce((sum, t) => sum + (t.points || 0), 0);

    // Overdue
    const now = new Date();
    this.stats.overdueTasks = tasks.filter(t => {
      if (t.status === 'COMPLETED') return false;
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < now;
    }).length;

    // 2. Pie Chart Gradient
    // Logic: Green (Completed) -> Blue (In Progress) -> Yellow (Pending)
    const total = this.stats.totalTasks || 1; // avoid divide by zero
    const pctCompleted = (this.stats.completedTasks / total) * 100;
    const pctInProgress = (this.stats.inProgressTasks / total) * 100;
    // const pctPending = 100 - pctCompleted - pctInProgress;
    
    // Convert to degrees for conic gradient
    const degCompleted = (pctCompleted / 100) * 360;
    const degInProgress = degCompleted + ((pctInProgress / 100) * 360);
    
    // Colors must match CSS variables or be hex codes
    // var(--green): #00E396 (completed)
    // var(--blue): #008FFB (in progress)
    // var(--yellow): #FEB019 (pending)
    // But we can just use the hex codes or try var() if it works in style binding (it usually does).
    // Safest is hex literals similar to the design if vars are flaky in bindings.
    this.pieStyle = `conic-gradient(
      #00E396 0deg ${degCompleted}deg, 
      #008FFB ${degCompleted}deg ${degInProgress}deg, 
      #FEB019 ${degInProgress}deg 360deg
    )`;

    // 3. Line Chart (Timeline) - Last 7 Days of Activity (Completion)
    const timeline = this.getLast7Days();
    this.xLabels = timeline.map(d => this.formatDate(d));
    
    // Map tasks to dates
    const dataPoints = timeline.map(dateStr => {
      // finding tasks completed on this day
      return tasks.filter(t => {
        if (t.status !== 'COMPLETED') return false;
        
        // Use completedAt if available, otherwise fallback to updatedAt (for older tasks)
        // logic: if completedAt exists, check it. If not, check updatedAt.
        const dateToUse = t.completedAt || t.updatedAt || t.createdAt;
        
        return dateToUse && dateToUse.startsWith(dateStr);
      }).length;
    });

    // Determine Y Axis Scale
    const maxVal = Math.max(...dataPoints, 4); // at least 4
    this.maxY = maxVal;
    // distribute 5 lines: 0, 1/4, 2/4, 3/4, 4/4
    this.yAxisLines = [
       maxVal,                          // Top
       Math.round(maxVal * 0.75), 
       Math.round(maxVal * 0.5), 
       Math.round(maxVal * 0.25), 
       0
    ];

    // Generate Path (SVG width 500, height 200, padding 50)
    // X range: 50 to 470
    // Y range: 180 (for 0) to 20 (for max)
    
    // x step = (470 - 50) / 6  (since 7 points)
    const xStep = 420 / 6;
    
    const points = dataPoints.map((val, i) => {
      const x = 50 + (i * xStep);
      // y = 180 - (val / maxVal) * (180 - 20)
      const height = 160; 
      const y = 180 - ((val / maxVal) * height);
      return `${x} ${y}`;
    });

    if (points.length > 0) {
      this.chartPath = `M ${points.join(' L ')}`;
    }
  }

  getLast7Days(): string[] {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  }

  formatDate(dateStr: string): string {
     const d = new Date(dateStr);
     return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
