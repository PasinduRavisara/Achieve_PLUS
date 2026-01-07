import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tooltip-arrow"></div>
    <div class="tooltip-content">{{ text }}</div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      z-index: 1000;
      pointer-events: none;
      animation: fadeIn 0.2s ease-out;
    }
    
    .tooltip-content {
      background: rgba(20, 20, 30, 0.9);
      backdrop-filter: blur(8px);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.8rem;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      white-space: nowrap;
    }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class TooltipComponent {
  @Input() text = '';
}
