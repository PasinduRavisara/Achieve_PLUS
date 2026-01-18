import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-progress-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-progress-analysis.html',
  styleUrl: './admin-progress-analysis.css',
})
export class AdminProgressAnalysis {
  timeframe = 'All Time';
  employeeFilter = 'All Employees';
  
  employees: any[] = [];
  allTasks: any[] = []; // Store raw data

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
  
  chartTitle = 'Task Completion Timeline';

  constructor(
    private taskService: TaskService, 
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.refresh();
  }
  
  loadEmployees() {
      this.userService.getAllUsers().subscribe(users => {
          this.employees = users.filter(u => u.role === 'Employee' || u.role === 'Admin'); // Show everyone?
      });
  }

  refresh() {
    // Add rotation class to button temporarily if we can bind it, 
    // but for now just fetch data.
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }
  
  applyFilters() {
      let filtered = [...this.allTasks];
      
      // 1. Employee Filter
      if (this.employeeFilter !== 'All Employees') {
          // Assuming filter matches Full Name or ID. Let's use ID if we bind value, but HTML uses name currently.
          // Let's assume we will bind the ID in the HTML for robustness.
          // OR if we keep names:
          filtered = filtered.filter(t => t.assignedToName === this.employeeFilter || (this.employeeFilter === 'Unassigned' && !t.assignedToName));
      }
      
      // 2. Timeframe Filter
      // We need to decide what date field to filter by. CreatedAt? UpdatedAt? 
      // Usually "Progress" implies activity, so CreatedAt or UpdatedAt.
      // Let's use CreatedAt for "New Tasks" feeling or UpdatedAt for "Recent Activity".
      // Let's use CreatedAt for consistency with "Total Tasks".
      const now = new Date();
      let startDate: Date | null = null;

      if (this.timeframe === 'Today') {
          startDate = new Date(now.setHours(0,0,0,0));
      } else if (this.timeframe === 'Last Week') {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (this.timeframe === 'Last Month') {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      if (startDate) {
          filtered = filtered.filter(t => {
              const d = new Date(t.createdAt);
              return d >= startDate!;
          });
      }
      
      this.updateChartTitle();
      this.processData(filtered);
      this.cdr.detectChanges();
  }
  
  updateChartTitle() {
      if (this.timeframe === 'Today') this.chartTitle = 'Task Timeline (Today)';
      else if (this.timeframe === 'Last Week') this.chartTitle = 'Task Timeline (Last 7 Days)';
      else if (this.timeframe === 'Last Month') this.chartTitle = 'Task Timeline (Last 30 Days)';
      else this.chartTitle = 'Task Timeline (All Time)';
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
      // Logic: If status is overdue OR (not completed and past due date)
      if (t.status === 'OVERDUE') return true;
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
    
    this.pieStyle = `conic-gradient(
      #00E396 0deg ${degCompleted}deg, 
      #008FFB ${degCompleted}deg ${degInProgress}deg, 
      #FEB019 ${degInProgress}deg 360deg
    )`;

    // 3. Line Chart (Timeline) 
    // Adapt range based on timeframe
    let days = 7;
    if (this.timeframe === 'Today') days = 1; // Hourly? Too complex for now, keep daily but maybe just show 1 point?
    // Actually, if 'Today', showing last 7 days doesn't make sense if we filtered data to only today.
    // If filter is active, the data passed to processData is ALREADY filtered.
    // So if users select 'Today', tasks array only has today's tasks.
    // The chart logic below matches date strings. 
    
    // Better approach: If timeframe is 'Last Month', show 30 days. If 'Last Week', show 7. If 'Today', maybe show hours?
    // For simplicity, let's keep 7 days as default visualization, but if data is limited, it just won't show older points.
    // BUT if we filter out older tasks, the line will be flat 0 for older days.
    
    // Let's adjust the X-axis range based on the filter.
    let timeline: string[] = [];
    if (this.timeframe === 'Last Month') {
        timeline = this.getLastNDays(30);
    } else if (this.timeframe === 'Today') {
        timeline = [this.ensureDateString(new Date())]; // Just today
    } else {
        timeline = this.getLastNDays(7); // Default
    }
    
    this.xLabels = timeline.map(d => this.formatDate(d));
    
    // Map tasks to dates
    const dataPoints = timeline.map(dateStr => {
      // finding tasks completed on this day
      return tasks.filter(t => {
        if (t.status !== 'COMPLETED') return false;
        const dateToUse = t.completedAt || t.updatedAt || t.createdAt;
        return dateToUse && dateToUse.startsWith(dateStr);
      }).length;
    });

    // ... (rest of chart generation logic same as before but using dynamic maxVal) ...
    // Determine Y Axis Scale
    const maxVal = Math.max(...dataPoints, 4); 
    this.maxY = maxVal;
    
    this.yAxisLines = [
       maxVal,                          
       Math.round(maxVal * 0.75), 
       Math.round(maxVal * 0.5), 
       Math.round(maxVal * 0.25), 
       0
    ];

    // Generate Path
    // Adjust xStep based on number of points
    const pointsCount = dataPoints.length;
    // Width 420 (470-50). 
    const xStep = pointsCount > 1 ? 420 / (pointsCount - 1) : 420; 
    
    const points = dataPoints.map((val, i) => {
      let x = 50 + (i * xStep);
      // For single point (Today), center it?
      if (pointsCount === 1) x = 260; 
      
      const height = 160; 
      const y = 180 - ((val / maxVal) * height);
      return `${x} ${y}`;
    });

    if (points.length > 0) {
      if (points.length === 1) {
          // Draw a small horizontal line or dot for single point
          this.chartPath = `M ${points[0]} L ${points[0]}`; 
          // Or maybe empty if only 1 point? Line charts need 2 points really.
          // Let's just render the point.
      } else {
          this.chartPath = `M ${points.join(' L ')}`;
      }
    } else {
        this.chartPath = '';
    }
  }

  getLastNDays(n: number): string[] {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) { // Reverse order: 6 days ago -> Today
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(this.ensureDateString(d));
    }
    return dates;
  }
  
  ensureDateString(d: Date): string {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  }

  formatDate(dateStr: string): string {
     const d = new Date(dateStr);
     return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
