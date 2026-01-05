package com.achieveplusbe.service;

import com.achieveplusbe.dto.TaskDTO;
import com.achieveplusbe.exception.ResourceNotFoundException;
import com.achieveplusbe.exception.UnauthorizedException;
import com.achieveplusbe.model.Task;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.TaskRepository;
import com.achieveplusbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AchievementService achievementService;
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

        if (taskDTO.getAssignedTo() != null) {
            User assignedUser = userRepository.findById(taskDTO.getAssignedTo())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + taskDTO.getAssignedTo()));
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

        task.setStatus(Task.TaskStatus.valueOf(status));
        
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

        taskRepository.delete(task);
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus().name());
        dto.setDueDate(task.getDueDate());
        dto.setPoints(task.getPoints());
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

        // Calculate total tasks by status
        long totalPendingTasks = allTasks.stream()
                .filter(task -> task.getStatus() == Task.TaskStatus.PENDING)
                .count();

        long totalInProgressTasks = allTasks.stream()
                .filter(task -> task.getStatus() == Task.TaskStatus.IN_PROGRESS)
                .count();

        long totalCompletedTasks = allTasks.stream()
                .filter(task -> task.getStatus() == Task.TaskStatus.COMPLETED)
                .count();

        // Calculate total points from completed tasks
        int totalPoints = allTasks.stream()
                .filter(task -> task.getStatus() == Task.TaskStatus.COMPLETED)
                .mapToInt(Task::getPoints)
                .sum();

        return Map.of(
            "totalPendingTasks", totalPendingTasks,
            "totalInProgressTasks", totalInProgressTasks,
            "totalCompletedTasks", totalCompletedTasks,
            "totalPoints", totalPoints
        );
    }
}


//
//@Service
//@RequiredArgsConstructor
//public class TaskService {
//
//    private final TaskRepository taskRepository;
//    private final UserRepository userRepository;
//    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
//
//    public List<TaskDTO> getAllTasks() {
//        return taskRepository.findAll().stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    public TaskDTO getTaskById(Long id) {
//        Task task = taskRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
//        return convertToDTO(task);
//    }
//
//    public List<TaskDTO> getTasksByUser(Long userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
//
//        return taskRepository.findByAssignedUser(user).stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    public List<TaskDTO> getCurrentUserTasks() {
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        return taskRepository.findByAssignedUser(user).stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public TaskDTO createTask(TaskDTO taskDTO) {
//        Task task = convertToEntity(taskDTO);
//        Task savedTask = taskRepository.save(task);
//        return convertToDTO(savedTask);
//    }
//
//    @Transactional
//    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
//        Task task = taskRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
//
//        // Update the task
//        task.setTitle(taskDTO.getTitle());
//        task.setDescription(taskDTO.getDescription());
//        task.setStatus(Task.TaskStatus.valueOf(taskDTO.getStatus()));
//        task.setDueDate(taskDTO.getDueDate());
//        task.setPoints(taskDTO.getPoints());
//
//        if (taskDTO.getAssignedTo() != null) {
//            User assignedUser = userRepository.findById(taskDTO.getAssignedTo())
//                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + taskDTO.getAssignedTo()));
//            task.setAssignedUser(assignedUser);
//        } else {
//            task.setAssignedUser(null);
//        }
//
//        Task updatedTask = taskRepository.save(task);
//        return convertToDTO(updatedTask);
//    }
//
//    @Transactional
//    public TaskDTO updateTaskStatus(Long id, String status) {
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        User currentUser = userRepository.findByEmail(email)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        Task task = taskRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
//
//        // Check if the task is assigned to the current user
//        if (task.getAssignedUser() == null || !task.getAssignedUser().getId().equals(currentUser.getId())) {
//            throw new UnauthorizedException("You are not authorized to update this task");
//        }
//
//        task.setStatus(Task.TaskStatus.valueOf(status));
//        Task updatedTask = taskRepository.save(task);
//        return convertToDTO(updatedTask);
//    }
//
//    @Transactional
//    public void deleteTask(Long id) {
//        Task task = taskRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
//
//        taskRepository.delete(task);
//    }
//
//    public Map<String, Object> getCurrentUserStats() {
//        // Get the current authenticated user
//        User currentUser = getCurrentAuthenticatedUser();
//
//        // Get tasks for the current user
//        List<Task> tasks = taskRepository.findByAssignedUser(currentUser);
//
//        // Calculate stats
//        long pendingTasks = tasks.stream()
//                .filter(task -> task.getStatus().equals(Task.TaskStatus.New) ||
//                        task.getStatus().equals(Task.TaskStatus.PENDING) ||
//                        task.getStatus().equals(Task.TaskStatus.ASSIGNED))
//                .count();
//
//        long inProgressTasks = tasks.stream()
//                .filter(task -> task.getStatus().equals(Task.TaskStatus.IN_PROGRESS))
//                .count();
//
//        long completedTasks = tasks.stream()
//                .filter(task -> task.getStatus().equals(Task.TaskStatus.COMPLETED) ||
//                        task.getStatus().equals(Task.TaskStatus.DONE))
//                .count();
//
//        int totalPoints = tasks.stream()
//                .filter(task -> task.getStatus().equals(Task.TaskStatus.COMPLETED) ||
//                        task.getStatus().equals(Task.TaskStatus.DONE))
//                .mapToInt(Task::getPoints)
//                .sum();
//
//        Map<String, Object> stats = new HashMap<>();
//        stats.put("pendingTasks", pendingTasks);
//        stats.put("inProgressTasks", inProgressTasks);
//        stats.put("completedTasks", completedTasks);
//        stats.put("totalPoints", totalPoints);
//
//        return stats;
//    }
//
//    private User getCurrentAuthenticatedUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String currentUsername = authentication.getName();
//        return userRepository.findByEmail(currentUsername)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//    }
//
//    private TaskDTO convertToDTO(Task task) {
//        TaskDTO dto = new TaskDTO();
//        dto.setId(task.getId());
//        dto.setTitle(task.getTitle());
//        dto.setDescription(task.getDescription());
//        dto.setStatus(task.getStatus().name());
//        dto.setDueDate(task.getDueDate());
//        dto.setPoints(task.getPoints());
//        dto.setCreatedAt(task.getCreatedAt().format(DATE_FORMATTER));
//
//        if (task.getAssignedUser() != null) {
//            dto.setAssignedTo(task.getAssignedUser().getId());
//            dto.setAssignedToName(task.getAssignedUser().getFullName());
//        }
//
//        return dto;
//    }
//
//    private Task convertToEntity(TaskDTO dto) {
//        Task task = new Task();
//        task.setTitle(dto.getTitle());
//        task.setDescription(dto.getDescription());
//        task.setStatus(Task.TaskStatus.valueOf(dto.getStatus()));
//        task.setDueDate(dto.getDueDate());
//        task.setPoints(dto.getPoints());
//
//        if (dto.getAssignedTo() != null) {
//            User assignedUser = userRepository.findById(dto.getAssignedTo())
//                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getAssignedTo()));
//            task.setAssignedUser(assignedUser);
//        }
//
//        return task;
//    }
//}
