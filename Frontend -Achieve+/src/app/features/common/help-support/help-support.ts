import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help-support',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-support.html',
  styleUrl: './help-support.css',
})
export class HelpSupport {
  searchQuery = '';
  
  categories = [
    { icon: 'bi-rocket-takeoff', title: 'Getting Started', desc: 'Onboarding and basics' },
    { icon: 'bi-check-circle', title: 'Tasks & Projects', desc: 'Managing your work' },
    { icon: 'bi-trophy', title: 'Rewards', desc: 'Redeeming points' },
    { icon: 'bi-person-gear', title: 'Account', desc: 'Profile settings' }
  ];

  faqs = [
    { 
      question: 'How do I redeem points?', 
      answer: 'Navigate to the Reward Store from the sidebar. Browse available items and click "Redeem" on any item you have enough points for.',
      open: false 
    },
    { 
      question: 'How are task points calculated?', 
      answer: 'Points are based on task complexity (priority) and estimated duration. High priority tasks award 50-100 points.',
      open: false 
    },
    { 
      question: 'Can I change my avatar?', 
      answer: 'Yes! Go to Settings > Profile to customize your avatar or upload a new photo.',
      open: false 
    },
    { 
      question: 'Who approves my completed tasks?', 
      answer: 'Your assigned Team Lead or Manager receives a notification when you complete a task.',
      open: false 
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
