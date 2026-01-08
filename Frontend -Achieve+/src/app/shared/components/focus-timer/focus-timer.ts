import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-focus-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './focus-timer.html',
  styleUrl: './focus-timer.css',
})
export class FocusTimer {
  minutes = 25;
  seconds = 0;
  isRunning = false;
  interval: any;
  mode: 'focus' | 'break' = 'focus';
  isOpen = false;

  toggleWidget() {
    this.isOpen = !this.isOpen;
  }

  toggleTimer() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.interval = setInterval(() => {
        if (this.seconds > 0) {
          this.seconds--;
        } else if (this.minutes > 0) {
          this.minutes--;
          this.seconds = 59;
        } else {
          // Timer finished
          this.isRunning = false;
          clearInterval(this.interval);
          this.playAlarm();
        }
      }, 1000);
    } else {
      clearInterval(this.interval);
    }
  }

  reset() {
    this.isRunning = false;
    clearInterval(this.interval);
    this.minutes = this.mode === 'focus' ? 25 : 5;
    this.seconds = 0;
  }

  setMode(mode: 'focus' | 'break') {
    this.mode = mode;
    this.reset();
  }

  playAlarm() {
    // Mock alarm
    alert("Time's up!");
  }

  get formattedTime() {
    return `${this.pad(this.minutes)}:${this.pad(this.seconds)}`;
  }

  pad(val: number) {
    return val < 10 ? `0${val}` : val; // Updated to classic string concat for safety
  }
}
