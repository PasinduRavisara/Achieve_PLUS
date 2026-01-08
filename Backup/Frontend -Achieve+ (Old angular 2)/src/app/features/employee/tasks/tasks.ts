import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-employee-tasks',
  standalone: true,
  imports: [CommonModule, GlassCard],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks {
  filter = signal<'todo' | 'inprogress' | 'done'>('todo');

  tasks = [
    { id: 1, title: 'Complete Project Documentation', status: 'todo', points: 50, due: 'Today' },
    { id: 2, title: 'Review Pull Requests', status: 'inprogress', points: 30, due: 'Tomorrow' },
    { id: 3, title: 'Update Client Profile', status: 'done', points: 20, due: 'Yesterday' },
    { id: 4, title: 'Prepare Weekly Slide Deck', status: 'todo', points: 100, due: 'Friday' },
    { id: 5, title: 'Fix Navigation Bug', status: 'inprogress', points: 75, due: 'Wed' },
  ];

  get filteredTasks() {
    return this.tasks.filter(t => t.status === this.filter());
  }

  setFilter(status: 'todo' | 'inprogress' | 'done') {
    this.filter.set(status);
  }
}
