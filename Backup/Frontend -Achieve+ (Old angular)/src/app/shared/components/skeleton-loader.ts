import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="skeleton-box" 
      [style.width]="width" 
      [style.height]="height" 
      [style.borderRadius]="borderRadius"
      [class.circle]="type === 'circle'"
      [class.text]="type === 'text'"
    ></div>
  `,
  styles: [`
    :host { display: block; }
    .skeleton-box {
      background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite linear;
    }
    .circle { border-radius: 50% !important; }
    .text { border-radius: 4px; height: 1em; }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() borderRadius = '8px';
  @Input() type: 'box' | 'circle' | 'text' = 'box';
}
