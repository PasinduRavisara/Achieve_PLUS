import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.css',
})
export class CommandPaletteComponent {
  isOpen = signal(false);

  @HostListener('window:keydown.control.k', ['$event'])
  @HostListener('window:keydown.meta.k', ['$event'])
  onCtrlK(event: Event) {
    event.preventDefault();
    this.isOpen.set(true);
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    this.close();
  }

  close() {
    this.isOpen.set(false);
  }
}
