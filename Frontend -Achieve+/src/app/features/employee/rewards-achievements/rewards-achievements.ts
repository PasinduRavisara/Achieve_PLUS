import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService, AchievementDTO } from '../../../core/services/achievement.service';
import { AuthService } from '../../../core/services/auth';

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

  achievements: AchievementDTO[] = [];

  constructor(
    private achievementService: AchievementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      // Get Stats
      this.achievementService.getUserStats(user.id).subscribe({
        next: (data) => {
          this.stats.badges = data.totalBadges;
          this.stats.points = data.totalPoints;
          this.stats.streak = data.currentStreak;
        },
        error: (err) => console.error('Failed to loading achievement stats', err)
      });

      // Get Achievements
      this.achievementService.getUserAchievements(user.id).subscribe({
        next: (data) => {
          this.achievements = data;
        },
        error: (err) => console.error('Failed to load achievements', err)
      });
    }
  }
}
