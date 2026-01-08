import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { FocusTimer } from '../../shared/components/focus-timer/focus-timer';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, FocusTimer],
  templateUrl: './employee-layout.html',
  styleUrl: './employee-layout.css',
})
export class EmployeeLayout {}
