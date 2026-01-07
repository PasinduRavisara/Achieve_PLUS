import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-streak-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './streak-tracker.html',
  styleUrl: './streak-tracker.css',
})
export class StreakTrackerComponent {
  @Input() streakCount = 0;
}
