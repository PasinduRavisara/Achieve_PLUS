package com.achieveplusbe.service;

import com.achieveplusbe.dto.TaskDTO;
import com.achieveplusbe.exception.ResourceNotFoundException;
import com.achieveplusbe.exception.UnauthorizedException;
import com.achieveplusbe.model.Task;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.TaskRepository;
import com.achieveplusbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class TaskService {

    private final com.achieveplusbe.repository.SystemLogRepository systemLogRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AchievementService achievementService;
    private final NotificationService notificationService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return convertToDTO(task);
    }

    public List<TaskDTO> getTasksByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return taskRepository.findByAssignedUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    
    public List<TaskDTO> getCurrentUserTasks() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Task> assignedTasks = taskRepository.findByAssignedUser(user);
        List<Task> createdTasks = taskRepository.findByCreatedBy(user);

        // Use a Set to avoid duplicates
        return Stream.concat(assignedTasks.stream(), createdTasks.stream())
                .distinct()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = convertToEntity(taskDTO);

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        task.setCreatedBy(currentUser);

        Task savedTask = taskRepository.save(task);

        if (savedTask.getAssignedUser() != null) {
            notificationService.createNotification(
                savedTask.getAssignedUser(),
                "New Task Assigned: " + savedTask.getTitle(),
                "INFO",
                savedTask.getId()
            );
        }

        return convertToDTO(savedTask);
    }

    @Transactional
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        // Update the task
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(Task.TaskStatus.valueOf(taskDTO.getStatus()));
        task.setDueDate(taskDTO.getDueDate());
        task.setPoints(taskDTO.getPoints());
        task.setPriority(taskDTO.getPriority());

        if (taskDTO.getAssignedTo() != null) {
            User assignedUser = userRepository.findById(taskDTO.getAssignedTo())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + taskDTO.getAssignedTo()));
            
            // Check if assignment changed
            if (task.getAssignedUser() == null || !task.getAssignedUser().getId().equals(assignedUser.getId())) {
                 notificationService.createNotification(
                    assignedUser,
                    "Task Assigned: " + task.getTitle(),
                    "INFO",
                    task.getId()
                );
            }
            task.setAssignedUser(assignedUser);
        } else {
            task.setAssignedUser(null);
        }

        Task updatedTask = taskRepository.save(task);
        return convertToDTO(updatedTask);
    }

    @Transactional
    public TaskDTO updateTaskStatus(Long id, String status) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        // Check if the task is assigned to the current user
        if (task.getAssignedUser() == null || !task.getAssignedUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this task");
        }

        Task.TaskStatus oldStatus = task.getStatus();
        Task.TaskStatus newStatus = Task.TaskStatus.valueOf(status);
        task.setStatus(newStatus);
        
        // Log for Trends
        if (newStatus == Task.TaskStatus.IN_PROGRESS && oldStatus != Task.TaskStatus.IN_PROGRESS) {
            systemLogRepository.save(com.achieveplusbe.model.SystemLog.builder().action("TASK_STARTED").entityType("TASK").build());
        } else if (oldStatus == Task.TaskStatus.IN_PROGRESS && newStatus != Task.TaskStatus.IN_PROGRESS) {
             systemLogRepository.save(com.achieveplusbe.model.SystemLog.builder().action("TASK_STOPPED").entityType("TASK").build());
        }

        if (newStatus == Task.TaskStatus.COMPLETED && oldStatus != Task.TaskStatus.COMPLETED) {
             systemLogRepository.save(com.achieveplusbe.model.SystemLog.builder().action("POINTS_EARNED").entityType("POINTS").build());
        }
        
        // Notify Admin (Creator) if completed
        if (newStatus == Task.TaskStatus.COMPLETED && task.getCreatedBy() != null) {
            notificationService.createNotification(
                task.getCreatedBy(),
                "Task Completed: " + task.getTitle() + " by " + currentUser.getFullName(),
                "SUCCESS",
                task.getId()
            );
        }
        
        // Check if task is being completed before due date
        if (task.getStatus() == Task.TaskStatus.COMPLETED && 
            task.getDueDate() != null && 
            LocalDate.now().isBefore(task.getDueDate())) {
            // Create achievement for early completion
            achievementService.createAchievement(task, currentUser);
        }

        Task updatedTask = taskRepository.save(task);
        return convertToDTO(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        if (task.getStatus() == Task.TaskStatus.IN_PROGRESS) {
             systemLogRepository.save(com.achieveplusbe.model.SystemLog.builder().action("TASK_STOPPED").entityType("TASK").build());
        }
        if (task.getStatus() == Task.TaskStatus.COMPLETED) {
             systemLogRepository.save(com.achieveplusbe.model.SystemLog.builder().action("POINTS_LOST").entityType("POINTS").build());
        }

        taskRepository.delete(task);
        
        com.achieveplusbe.model.SystemLog log = com.achieveplusbe.model.SystemLog.builder()
                .action("TASK_DELETED")
                .entityType("TASK")
                .build();
        systemLogRepository.save(log);
    }

    private TaskDTO convertToDTO(Task task) {
        // ... (lines 179-223 omitted, keeping existing methods)
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus().name());
        dto.setDueDate(task.getDueDate());
        dto.setPoints(task.getPoints());
        dto.setPriority(task.getPriority());
        dto.setCreatedAt(task.getCreatedAt().format(DATE_FORMATTER));

        if (task.getAssignedUser() != null) {
            dto.setAssignedTo(task.getAssignedUser().getId());
            dto.setAssignedToName(task.getAssignedUser().getFullName());
        }

        if (task.getCreatedBy() != null) {
            dto.setCreatedBy(task.getCreatedBy().getId());
            dto.setCreatedByName(task.getCreatedBy().getFullName());
        }

        return dto;
    }
    
    private Task convertToEntity(TaskDTO dto) {
         Task task = new Task();
         task.setTitle(dto.getTitle());
         task.setDescription(dto.getDescription());
         task.setStatus(Task.TaskStatus.valueOf(dto.getStatus()));
         task.setDueDate(dto.getDueDate());
         task.setPoints(dto.getPoints());
         task.setPriority(dto.getPriority());
 
         if (dto.getAssignedTo() != null) {
             User assignedUser = userRepository.findById(dto.getAssignedTo())
                     .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getAssignedTo()));
             task.setAssignedUser(assignedUser);
         }
 
         return task;
    }

    public Map<String, Object> getCurrentUserStats() {
        return Map.of();
    }

    public Map<String, Object> getAdminStats() {
        List<Task> allTasks = taskRepository.findAll();
        long totalUsers = userRepository.count();

        long pending = allTasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.PENDING).count();
        long inProgress = allTasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.IN_PROGRESS).count();
        long completed = allTasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.COMPLETED).count();

        int totalTaskPoints = allTasks.stream()
                .filter(t -> t.getStatus() == Task.TaskStatus.COMPLETED)
                .mapToInt(Task::getPoints)
                .sum();

        int totalBasePoints = userRepository.findAll().stream()
                .mapToInt(User::getPoints)
                .sum();

        int totalPoints = totalTaskPoints + totalBasePoints;

        // Trends visibility Rule: Only show activity from last 10 minutes
        LocalDateTime tenMinutesAgo = LocalDateTime.now().minusMinutes(10);

        // 1. Tasks Trend
        List<LocalDateTime> taskCreates = allTasks.stream()
                .filter(t -> t.getCreatedAt() != null && t.getCreatedAt().isAfter(tenMinutesAgo))
                .map(Task::getCreatedAt)
                .collect(Collectors.toList());
        List<LocalDateTime> taskDeletes = systemLogRepository.findByActionAndTimestampAfter("TASK_DELETED", tenMinutesAgo)
                .stream().map(com.achieveplusbe.model.SystemLog::getTimestamp).collect(Collectors.toList());

        String tasksTrend = calculateStreakTrend(taskCreates, taskDeletes, "New", "Removed");


        // 2. Users Trend
        List<LocalDateTime> userCreates = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(tenMinutesAgo))
                .map(User::getCreatedAt)
                .collect(Collectors.toList());
        List<LocalDateTime> userDeletes = systemLogRepository.findByActionAndTimestampAfter("USER_DELETED", tenMinutesAgo)
                .stream().map(com.achieveplusbe.model.SystemLog::getTimestamp).collect(Collectors.toList());

        String usersTrend = calculateStreakTrend(userCreates, userDeletes, "New", "Removed");


        // 3. In Progress Trend
        List<LocalDateTime> progressStarts = systemLogRepository.findByActionAndTimestampAfter("TASK_STARTED", tenMinutesAgo)
             .stream().map(com.achieveplusbe.model.SystemLog::getTimestamp).collect(Collectors.toList());
        List<LocalDateTime> progressStops = systemLogRepository.findByActionAndTimestampAfter("TASK_STOPPED", tenMinutesAgo)
             .stream().map(com.achieveplusbe.model.SystemLog::getTimestamp).collect(Collectors.toList());
             
        String inProgressTrend = calculateStreakTrend(progressStarts, progressStops, "Active", "Inactive");

        // 4. Points Trend
        List<LocalDateTime> pointsGained = systemLogRepository.findByActionAndTimestampAfter("POINTS_EARNED", tenMinutesAgo)
            .stream().map(com.achieveplusbe.model.SystemLog::getTimestamp).collect(Collectors.toList());
        List<LocalDateTime> pointsLost = systemLogRepository.findByActionAndTimestampAfter("POINTS_LOST", tenMinutesAgo)
            .stream().map(com.achieveplusbe.model.SystemLog::getTimestamp).collect(Collectors.toList());
            
        String pointsTrend = calculateStreakTrend(pointsGained, pointsLost, "This Month", "Lost");

        return Map.of(
            "totalTasks", (long) allTasks.size(),
            "pendingTasks", pending,
            "inProgressTasks", inProgress,
            "completedTasks", completed,
            "totalPoints", totalPoints,
            "totalUsers", totalUsers,
            "tasksTrend", tasksTrend != null ? tasksTrend : "",
            "usersTrend", usersTrend != null ? usersTrend : "",
            "inProgressTrend", inProgressTrend != null ? inProgressTrend : "",
            "pointsTrend", pointsTrend != null ? pointsTrend : ""
        );
    }

    private String calculateStreakTrend(List<LocalDateTime> creates, List<LocalDateTime> deletes, String createLabel, String deleteLabel) {
        if (creates.isEmpty() && deletes.isEmpty()) {
            return null;
        }

        // Combine events
        List<TrendEvent> events = new java.util.ArrayList<>();
        creates.forEach(t -> events.add(new TrendEvent(t, "CREATE")));
        deletes.forEach(t -> events.add(new TrendEvent(t, "DELETE")));

        // Sort descending
        events.sort((a, b) -> b.timestamp.compareTo(a.timestamp));

        if (events.isEmpty()) return null;

        // Determine streak
        String currentMode = events.get(0).type; // "CREATE" or "DELETE"
        long count = 0;

        for (TrendEvent event : events) {
            if (event.type.equals(currentMode)) {
                count++;
            } else {
                break; // Streak broken
            }
        }

        if (currentMode.equals("CREATE")) {
            return "+" + count + " " + createLabel;
        } else {
            return "-" + count + " " + deleteLabel;
        }
    }

    @lombok.AllArgsConstructor
    private static class TrendEvent {
        LocalDateTime timestamp;
        String type;
    }
}


