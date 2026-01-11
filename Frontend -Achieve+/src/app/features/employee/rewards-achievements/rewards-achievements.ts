import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rewards-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rewards-achievements.html',
  styleUrl: './rewards-achievements.css',
})
export class RewardsAchievements {
  stats = {
    badges: 0,
    points: 0,
    streak: 0
  };

  achievements: any[] = []; // Empty state to match screenshot 3
}
