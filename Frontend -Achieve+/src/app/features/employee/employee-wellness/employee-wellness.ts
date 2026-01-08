import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-wellness',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-wellness.html',
  styleUrl: './employee-wellness.css',
})
export class EmployeeWellness {
  moods = [
    { icon: 'bi-emoji-smile-fill', label: 'Happy', color: '#ffdd00' },
    { icon: 'bi-emoji-neutral-fill', label: 'Neutral', color: '#a0a0a0' },
    { icon: 'bi-emoji-frown-fill', label: 'Stressed', color: '#ff5555' },
    { icon: 'bi-emoji-dizzy-fill', label: 'Tired', color: '#a0b0ff' },
  ];

  isBreathing = false;
  breathingText = 'Ready?';

  toggleBreathing() {
    this.isBreathing = !this.isBreathing;
    if (this.isBreathing) {
      this.breathingText = 'Inhale...';
      // Simple text update simulation
      setTimeout(() => this.breathingText = 'Hold...', 4000);
      setTimeout(() => this.breathingText = 'Exhale...', 8000);
      setInterval(() => {
        if (!this.isBreathing) return;
        this.breathingText = 'Inhale...';
        setTimeout(() => { if(this.isBreathing) this.breathingText = 'Hold...'; }, 4000);
        setTimeout(() => { if(this.isBreathing) this.breathingText = 'Exhale...'; }, 8000);
      }, 12000);
    } else {
      this.breathingText = 'Ready?';
    }
  }

  logMood(mood: any) {
    alert(`Mood logged: ${mood.label}`);
  }
}
