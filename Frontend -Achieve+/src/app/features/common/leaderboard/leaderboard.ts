import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  trend: 'up' | 'down' | 'same';
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard {
  topPlayers: LeaderboardEntry[] = [];
  otherPlayers: LeaderboardEntry[] = [];

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.refreshLeaderboard();
  }

  refreshLeaderboard() {
    this.userService.getLeaderboard().subscribe({
      next: (users) => {
        // Backend should ideally sort, but we sort here to be safe
        const sorted = users.sort((a, b) => b.points - a.points);
        
        const entries: LeaderboardEntry[] = sorted.map((u, index) => ({
          rank: index + 1,
          name: u.fullName,
          points: u.points,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`,
          trend: 'same' // Placeholder
        }));

        this.topPlayers = entries.slice(0, 3);
        this.otherPlayers = entries.slice(3);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load leaderboard', err)
    });
  }
}
