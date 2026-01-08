import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
}

interface Column {
  name: string;
  status: string;
  tasks: Task[];
}

@Component({
  selector: 'app-admin-task-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-task-dashboard.html',
  styleUrl: './admin-task-dashboard.css',
})
export class AdminTaskDashboard {
  columns: Column[] = [
    {
      name: 'To Do',
      status: 'todo',
      tasks: [
        { id: 1, title: 'Design Homepage', assignee: 'John Doe', priority: 'high' },
        { id: 2, title: 'Setup Database', assignee: 'Mike Ross', priority: 'medium' }
      ]
    },
    {
      name: 'In Progress',
      status: 'inprogress',
      tasks: [
        { id: 3, title: 'Implement Auth', assignee: 'Jane Smith', priority: 'high' }
      ]
    },
    {
      name: 'Review',
      status: 'review',
      tasks: [
        { id: 4, title: 'API Documentation', assignee: 'Rachel Zane', priority: 'low' }
      ]
    },
    {
      name: 'Done',
      status: 'done',
      tasks: [
        { id: 5, title: 'Initial Project Setup', assignee: 'Harvey Specter', priority: 'high' }
      ]
    }
  ];

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return '';
    }
  }
}
