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
  featuredAchievement = { title: 'Employee of the Month', icon: 'bi-trophy-fill', description: 'Awarded for outstanding performance in June.', date: 'June 2026' };
  
  achievements = [
    { title: 'Task Master', icon: 'bi-check-circle-fill', description: 'Completed 100 tasks', unlocked: true },
    { title: 'Early Bird', icon: 'bi-alarm-fill', description: 'Clocked in before 8AM for a week', unlocked: true },
    { title: 'Bug Hunter', icon: 'bi-bug-fill', description: 'Found and reported 50 bugs', unlocked: true },
    { title: 'Team Player', icon: 'bi-people-fill', description: 'Participated in 10 team events', unlocked: false },
    { title: 'Mentor', icon: 'bi-lightbulb-fill', description: 'Helped onboard a new hire', unlocked: false },
    { title: 'Streak Master', icon: 'bi-fire', description: '7-day login streak', unlocked: true },
  ];
}
