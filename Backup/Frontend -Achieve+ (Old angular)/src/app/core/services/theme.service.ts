import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal to track current theme state
  isDarkMode = signal<boolean>(true); // Default to dark mode as per requirements

  constructor() {
    // Initialize theme based on saved preference or default
    this.initializeTheme();
    
    // Effect to apply theme class to body whenever signal changes
    effect(() => {
      if (this.isDarkMode()) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      }
    });
  }

  private initializeTheme() {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Default to dark mode for that premium feel
      this.isDarkMode.set(true); 
    }
  }

  toggleTheme() {
    this.isDarkMode.update(current => !current);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  // Future expansion: Adaptive brightness based on time
  setAdaptiveTheme() {
    const hour = new Date().getHours();
    // simpler logic for now: 7am to 7pm is light, else dark
    const isDayTime = hour > 7 && hour < 19;
    this.isDarkMode.set(!isDayTime);
  }
}
