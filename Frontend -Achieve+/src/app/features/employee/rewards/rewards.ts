import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, GlassCard],
  templateUrl: './rewards.html',
  styleUrl: './rewards.css'
})
export class Rewards {
  achievements = [
    { id: 1, title: 'Early Bird', description: 'Completed 5 tasks before 10 AM', icon: '🌅', date: '2023-10-15', rarity: 'common' },
    { id: 2, title: 'Task Master', description: 'Completed 100 tasks total', icon: '⚔️', date: '2023-11-01', rarity: 'rare' },
    { id: 3, title: 'Perfect Week', description: 'All tasks completed on time for a week', icon: '🔥', date: '2023-11-20', rarity: 'legendary' },
    { id: 4, title: 'Team Player', description: 'Received 5 kudos from peers', icon: '🤝', date: '2023-12-05', rarity: 'common' },
  ];
}
