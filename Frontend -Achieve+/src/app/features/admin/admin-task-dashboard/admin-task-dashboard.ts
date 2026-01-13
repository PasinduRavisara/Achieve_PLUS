import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, TaskDTO } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-task-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-task-dashboard.html',
  styleUrl: './admin-task-dashboard.css',
})
export class AdminTaskDashboard {
  private cdr = inject(ChangeDetectorRef);
  private userService = inject(UserService);

  activeTab = 'all';
  tasks: TaskDTO[] = [];
  employees: any[] = [];
  
  showTaskModal = false;
  editingTaskId: number | null = null;
  newTask: Partial<TaskDTO> = {
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      assignedTo: undefined,
      points: 10,
      status: 'Pending'
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.refreshTasks();
    this.loadEmployees();
  }
  
  loadEmployees() {
      this.userService.getAllUsers().subscribe(users => this.employees = users);
  }

  get filteredTasks() {
    if (this.activeTab === 'all') return this.tasks;
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'inprogress': 'In Progress',
      'completed': 'Completed'
    };
    return this.tasks.filter(t => t.status === statusMap[this.activeTab] || t.status === this.activeTab);
  }

  get pendingCount() { return this.tasks.filter(t => t.status === 'Pending').length; }
  get inProgressCount() { return this.tasks.filter(t => t.status === 'In Progress').length; }
  get completedCount() { return this.tasks.filter(t => t.status === 'Completed').length; }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  getPriorityClass(priority: string | undefined): string {
    if (!priority) return '';
    switch(priority.toLowerCase()) {
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-inprogress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  }

  refreshTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
          this.tasks = data;
          this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load admin tasks', err)
    });
  }
  
  openTaskModal(task?: TaskDTO, event?: Event) {
      if(event) event.stopPropagation();
      this.editingTaskId = task ? task.id : null;
      if (task) {
          this.newTask = { ...task };
      } else {
          this.newTask = { title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: undefined, points: 10, status: 'Pending' };
      }
      this.showTaskModal = true;
  }
  
  closeTaskModal() {
      this.showTaskModal = false;
  }
  
  saveTask() {
      if(!this.newTask.title || !this.newTask.assignedTo) return;
      
      const sub = this.editingTaskId 
          ? this.taskService.updateTask(this.editingTaskId, this.newTask)
          : this.taskService.createTask(this.newTask);
          
      sub.subscribe({
          next: () => {
              this.refreshTasks();
              this.closeTaskModal();
          },
          error: (err) => console.error('Save task failed', err)
      });
  }
  
  deleteTask(id: number, event: Event) {
      event.stopPropagation();
      if(confirm('Delete this task?')) {
          this.taskService.deleteTask(id).subscribe(() => this.refreshTasks());
      }
  }
}
