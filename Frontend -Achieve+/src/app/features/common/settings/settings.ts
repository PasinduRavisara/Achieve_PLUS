import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  settings = {
    notifications: true,
    emailAlerts: false,
    soundEffects: true,
    publicProfile: true,
    darkMode: true // Always true for this theme, but user might feel control
  };
}
