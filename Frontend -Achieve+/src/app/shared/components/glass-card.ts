import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel card-content" [class.hover-effect]="interactive">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .card-content {
      height: 100%;
      padding: 1.5rem;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                  box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .hover-effect:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      border-color: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class GlassCardComponent {
  @Input() interactive = false;
}
