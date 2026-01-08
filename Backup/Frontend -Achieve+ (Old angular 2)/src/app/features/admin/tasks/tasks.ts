import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-admin-tasks',
  standalone: true,
  imports: [CommonModule, GlassCard],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks {
  // Admin view needing management actions
  tasks = [
    { id: 101, title: 'Q3 Financial Report', assignee: 'Sarah J.', status: 'review', priority: 'high' },
    { id: 102, title: 'Update Landing Page', assignee: 'Mike T.', status: 'inprogress', priority: 'medium' },
    { id: 103, title: 'Database Migration', assignee: 'Emily C.', status: 'blocked', priority: 'critical' },
    { id: 104, title: 'User Interviews', assignee: 'Alex R.', status: 'done', priority: 'low' },
  ];

  approve(id: number) {
    // Logic to approve task
  }
}
