import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WellnessService } from '../../../core/services/wellness.service';

@Component({
  selector: 'app-employee-wellness',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-wellness.html',
  styleUrl: './employee-wellness.css',
})
export class EmployeeWellness implements OnInit {
  private wellnessService = inject(WellnessService);
  
  moods = [
    { icon: 'bi-emoji-smile-fill', label: 'HAPPY', color: '#ffdd00' },
    { icon: 'bi-emoji-neutral-fill', label: 'NEUTRAL', color: '#a0a0a0' },
    { icon: 'bi-emoji-frown-fill', label: 'STRESSED', color: '#ff5555' },
    { icon: 'bi-emoji-dizzy-fill', label: 'TIRED', color: '#a0b0ff' },
  ];

  isBreathing = false;
  breathingText = 'Ready?';
  
  stats: any = { completed: 0, pending: 0, inProgress: 0 };
  
  bubbles = Array(21).fill(false); // 21 bubbles

  ngOnInit() {
    this.wellnessService.getStats().subscribe((res: any) => this.stats = res);
  }

  toggleBreathing() {
    this.isBreathing = !this.isBreathing;
    if (this.isBreathing) {
      this.breathingText = 'Inhale...';
      const cycle = () => {
          if (!this.isBreathing) return;
          this.breathingText = 'Inhale...';
          setTimeout(() => { if(this.isBreathing) this.breathingText = 'Hold...'; }, 4000);
          setTimeout(() => { if(this.isBreathing) this.breathingText = 'Exhale...'; }, 11000); // 4+7 = 11
          setTimeout(cycle, 19000); // 4+7+8 = 19
      };
      
      cycle();
    } else {
      this.breathingText = 'Ready?';
    }
  }

  logMood(mood: any) {
    this.wellnessService.logMood(mood.label).subscribe(() => {
        // Maybe show toast instead of alert?
        // Using confirm/alert for now as requested by user previously?
        // User didn't request alert specifically, but "make it better".
        // I will just use a temporary state or console log for simplicity/polish.
        // Alert is intrusive. I'll just change button style temporarily? 
        alert(`Mood logged: ${mood.label}`);
    });
  }
  
  popBubble(index: number) {
      if (!this.bubbles[index]) {
          this.bubbles[index] = true;
          // Could add sound here
          if (this.bubbles.every(b => b)) {
              setTimeout(() => this.bubbles = Array(21).fill(false), 1500);
          }
      }
  }
}
