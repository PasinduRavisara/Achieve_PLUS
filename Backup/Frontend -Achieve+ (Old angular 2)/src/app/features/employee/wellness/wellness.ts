import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-wellness',
  standalone: true,
  imports: [CommonModule, GlassCard],
  templateUrl: './wellness.html',
  styleUrl: './wellness.css'
})
export class Wellness {
  selectedMood: string | null = null;
  moods = ['😊', '😐', '😔', '😫', '😎'];
  
  tips = [
    { title: 'Take a break', text: 'Stand up and stretch for 5 minutes.' },
    { title: 'Hydrate', text: 'Drink a glass of water.' },
    { title: 'Breath', text: 'Box breathing: 4s in, 4s hold, 4s out.' },
  ];

  selectMood(mood: string) {
    this.selectedMood = mood;
  }
}
