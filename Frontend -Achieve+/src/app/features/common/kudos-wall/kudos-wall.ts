import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Kudos {
  id: number;
  from: string;
  to: string;
  message: string;
  avatar: string;
  date: string;
  likes: number;
  tags: string[];
}

@Component({
  selector: 'app-kudos-wall',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kudos-wall.html',
  styleUrl: './kudos-wall.css',
})
export class KudosWall {
  kudosList: Kudos[] = [
    {
      id: 1,
      from: 'Mike Ross',
      to: 'Rachel Zane',
      message: 'Huge thanks for helping me with the API documentation! Couldn\'t have done it without you.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      date: '2 hours ago',
      likes: 5,
      tags: ['#Teamwork', '#Lifesaver']
    },
    {
      id: 2,
      from: 'Harvey Specter',
      to: 'The Whole Team',
      message: 'Great job closing the Q4 targets early. Drinks on me this Friday!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harvey',
      date: '5 hours ago',
      likes: 24,
      tags: ['#Winning', '#Celebrate']
    },
    {
      id: 3,
      from: 'Sarah Connor',
      to: 'John Doe',
      message: 'Thanks for fixing the login bug so quickly.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      date: '1 day ago',
      likes: 3,
      tags: ['#BugSquasher', '#Efficiency']
    }
  ];

  newKudos = { to: '', message: '' };
  showCompose = false;

  toggleCompose() {
    this.showCompose = !this.showCompose;
  }

  submitKudos() {
    if (this.newKudos.to && this.newKudos.message) {
      this.kudosList.unshift({
        id: Date.now(),
        from: 'You', // Logic would grab current user
        to: this.newKudos.to,
        message: this.newKudos.message,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', // Current User Avatar
        date: 'Just now',
        likes: 0,
        tags: ['#Appreciation']
      });
      this.newKudos = { to: '', message: '' };
      this.showCompose = false;
    }
  }

  like(kudos: Kudos) {
    kudos.likes++;
  }
}
