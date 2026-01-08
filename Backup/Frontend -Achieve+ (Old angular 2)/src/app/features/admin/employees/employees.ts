import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, GlassCard],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees {
  employees = [
    { id: 1, name: 'Sarah Jenkins', role: 'Designer', email: 'sarah@achieve.plus', status: 'Active', lastActive: '2 min ago' },
    { id: 2, name: 'Mike Thompson', role: 'Frontend Dev', email: 'mike@achieve.plus', status: 'Active', lastActive: '1 hr ago' },
    { id: 3, name: 'Emily Chen', role: 'Backend Dev', email: 'emily@achieve.plus', status: 'On Leave', lastActive: '2 days ago' },
    { id: 4, name: 'Alex Rivera', role: 'Product Manager', email: 'alex@achieve.plus', status: 'Active', lastActive: '5 min ago' },
  ];
}
