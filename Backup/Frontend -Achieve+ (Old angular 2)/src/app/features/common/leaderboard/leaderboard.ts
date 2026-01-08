import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, GlassCard],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css'
})
export class Leaderboard {
  leaders = [
    { rank: 1, name: 'Sarah Jenkins', role: 'Designer', points: 3450, trend: '⬆️' },
    { rank: 2, name: 'Mike Thompson', role: 'Frontend Dev', points: 3120, trend: '➖' },
    { rank: 3, name: 'Alex Rivera', role: 'Product Manager', points: 2980, trend: '⬆️' },
    { rank: 4, name: 'Emily Chen', role: 'Backend Dev', points: 2850, trend: '⬇️' },
    { rank: 5, name: 'David Kim', role: 'QA Engineer', points: 2700, trend: '⬆️' },
  ];
}
