import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, GlassCard],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  notifications = true;
  darkMode = true;
  sound = false;

  toggle(setting: string) {
    if (setting === 'notifications') this.notifications = !this.notifications;
    if (setting === 'sound') this.sound = !this.sound;
  }
}
