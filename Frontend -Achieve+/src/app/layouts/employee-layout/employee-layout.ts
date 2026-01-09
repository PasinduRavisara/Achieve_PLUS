import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { FocusTimer } from '../../shared/components/focus-timer/focus-timer';
import { TopBar } from '../../shared/components/top-bar/top-bar';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, FocusTimer, TopBar],
  templateUrl: './employee-layout.html',
  styleUrl: './employee-layout.css',
})
export class EmployeeLayout {}
