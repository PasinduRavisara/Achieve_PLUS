import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';
import { AuthService } from '../../../core/services/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GlassCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
    private authService = inject(AuthService);
    user = toSignal(this.authService.currentUser$);

    // Date
    today = new Date();

    // Streak
    currentStreak = 5;

    // Detailed Stats (from old functionalities)
    totalTasks = 24;
    completedTasks = 18;
    inProgressTasks = 4;
    pendingTasks = 2; // "To Do"
    
    completionRate = 75; //%

    // Reminders
    reminders = [
        { id: 1, text: "Submit Weekly Report", time: "2:00 PM", done: false },
        { id: 2, text: "Team Sync", time: "4:00 PM", done: false },
        { id: 3, text: "Review PRs", time: "Tomorrow", done: true }
    ];

    recentActivity = [
        { id: 1, text: 'Completed "Design Review"', time: '2h ago', type: 'task' },
        { id: 2, text: 'Earned "Early Bird" badge', time: '5h ago', type: 'reward' },
        { id: 3, text: 'Reached 5 day streak', time: '1d ago', type: 'streak' }
    ];

    toggleReminder(id: number) {
        const r = this.reminders.find(x => x.id === id);
        if (r) r.done = !r.done;
    }
}
