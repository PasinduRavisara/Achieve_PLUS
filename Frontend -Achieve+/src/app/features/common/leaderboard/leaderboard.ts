import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  topPlayers: LeaderboardEntry[] = [
    { rank: 1, name: 'Ravisara', points: 15400, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravisara', trend: 'up' },
    { rank: 2, name: 'John Doe', points: 11200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', trend: 'same' },
    { rank: 3, name: 'Jane Smith', points: 10800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', trend: 'up' },
  ];

  otherPlayers: LeaderboardEntry[] = [
    { rank: 4, name: 'Mike Ross', points: 9500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', trend: 'down' },
    { rank: 5, name: 'Rachel Zane', points: 8900, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel', trend: 'up' },
    { rank: 6, name: 'Harvey Specter', points: 8750, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harvey', trend: 'same' },
    { rank: 7, name: 'Louis Litt', points: 8200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Louis', trend: 'down' },
    { rank: 8, name: 'Donna Paulsen', points: 7800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Donna', trend: 'up' },
  ];
}
