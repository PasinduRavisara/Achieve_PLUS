import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, TaskDTO } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { SearchService } from '../../../core/services/search.service';

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
      status: 'PENDING'
  };

  minDate: string = '';
  
  errors = {
    title: false,
    dueDate: false,
    assignedTo: false
  };

  constructor(private taskService: TaskService) {}
  
  // ...

  saveTask() {
      // Reset errors
      this.errors = { title: false, dueDate: false, assignedTo: false };
      let hasError = false;

      if (!this.newTask.title) { this.errors.title = true; hasError = true; }
      // Due Date is optional now
      if (!this.newTask.assignedTo) { this.errors.assignedTo = true; hasError = true; }
      
      if (hasError) return;
      
      if (this.newTask.points! < 0) {
          alert('Points must be 0 or greater.');
          return;
      }
      
      if (this.newTask.dueDate && this.newTask.dueDate < this.minDate) {
           alert('Due date must be in the future.');
           return;
      }
      
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

  /* Search Logic */
  private searchService = inject(SearchService);
  currentSearchQuery = '';

  ngOnInit() {
    this.refreshTasks();
    this.loadEmployees();
    const today = new Date();
    today.setDate(today.getDate() + 1); // Set to tomorrow
    this.minDate = today.toISOString().split('T')[0];
    
    this.searchService.searchQuery$.subscribe(q => {
        this.currentSearchQuery = q;
        this.cdr.detectChanges(); // search comes from outside
    });
  }

  loadEmployees() {
      this.userService.getAllUsers().subscribe(users => this.employees = users);
  }

  // ...

  get filteredTasks() {
    let tasksToFilter = this.tasks;
    
    if (this.activeTab !== 'all') {
        const statusMap: Record<string, string> = {
          'pending': 'PENDING',
          'inprogress': 'IN_PROGRESS',
          'completed': 'COMPLETED'
        };
        tasksToFilter = this.tasks.filter(t => t.status === statusMap[this.activeTab] || t.status === this.activeTab);
    }
    
    if (this.currentSearchQuery) {
        const q = this.currentSearchQuery.toLowerCase();
        tasksToFilter = tasksToFilter.filter(t => t.title.toLowerCase().includes(q));
    }
    
    return tasksToFilter;
  }

  get pendingCount() { return this.tasks.filter(t => t.status === 'PENDING').length; }
  get inProgressCount() { return this.tasks.filter(t => t.status === 'IN_PROGRESS').length; }
  get completedCount() { return this.tasks.filter(t => t.status === 'COMPLETED').length; }

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
      case 'PENDING': return 'status-pending';
      case 'IN_PROGRESS': return 'status-inprogress';
      case 'COMPLETED': return 'status-completed';
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
          this.newTask = { title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: undefined, points: 10, status: 'PENDING' };
      }
      this.showTaskModal = true;
  }
  
  closeTaskModal() {
      this.showTaskModal = false;
  }
  

  
  // Delete Confirmation
  showDeleteModal = false;
  taskToDeleteId: number | null = null;
  
  deleteTask(id: number, event: Event) {
      event.stopPropagation();
      this.taskToDeleteId = id;
      this.showDeleteModal = true;
  }
  
  confirmDelete() {
      if (this.taskToDeleteId) {
          this.taskService.deleteTask(this.taskToDeleteId).subscribe(() => {
              this.refreshTasks();
              this.closeDeleteModal();
          });
      }
  }
  
  closeDeleteModal() {
      this.showDeleteModal = false;
      this.taskToDeleteId = null;
  }

  // Details Modal
  showDetailsModal = false;
  selectedTask: TaskDTO | null = null;
  selectedTaskIndex: number = -1;

  openDetailsModal(task: TaskDTO, index: number) {
      this.selectedTask = task;
      this.selectedTaskIndex = index;
      this.showDetailsModal = true;
  }

  closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedTask = null;
  }
}
