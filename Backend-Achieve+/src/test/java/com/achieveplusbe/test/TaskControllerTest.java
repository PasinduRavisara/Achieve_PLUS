package com.achieveplusbe.test;

import com.achieveplusbe.controller.TaskController;
import com.achieveplusbe.dto.TaskDTO;
import com.achieveplusbe.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    private TaskDTO taskDTO;
    private List<TaskDTO> taskList;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
        taskDTO = new TaskDTO(1L, "Task Title", "Task Description", "PENDING", 10);
        taskList = Arrays.asList(taskDTO);
    }

    @Test
    void testGetCurrentUserTasks() {
        // Mock the service method
        when(taskService.getCurrentUserTasks()).thenReturn(taskList);

        // Call the controller method
        ResponseEntity<List<TaskDTO>> response = taskController.getCurrentUserTasks();

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(taskList, response.getBody());
        verify(taskService, times(1)).getCurrentUserTasks();
    }

    @Test
    void testGetTaskById() {
        Long taskId = 1L;

        // Mock the service method
        when(taskService.getTaskById(taskId)).thenReturn(taskDTO);

        // Call the controller method
        ResponseEntity<TaskDTO> response = taskController.getTaskById(taskId);

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(taskDTO, response.getBody());
        verify(taskService, times(1)).getTaskById(taskId);
    }

    @Test
    void testUpdateTaskStatus() {
        Long taskId = 1L;
        String status = "COMPLETED";

        // Mock the service method
        when(taskService.updateTaskStatus(taskId, status)).thenReturn(taskDTO);

        // Call the controller method
        ResponseEntity<TaskDTO> response = taskController.updateTaskStatus(taskId, Map.of("status", status));

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(taskDTO, response.getBody());
        verify(taskService, times(1)).updateTaskStatus(taskId, status);
    }

    @Test
    void testGetCurrentUserStats() {
        // Mock the service method
        Map<String, Object> stats = Map.of("tasksCompleted", 5, "tasksInProgress", 3);
        when(taskService.getCurrentUserStats()).thenReturn(stats);

        // Call the controller method
        ResponseEntity<Map<String, Object>> response = taskController.getCurrentUserStats();

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(stats, response.getBody());
        verify(taskService, times(1)).getCurrentUserStats();
    }

    @Test
    void testGetAllTasks() {
        // Mock the service method
        when(taskService.getAllTasks()).thenReturn(taskList);

        // Call the controller method
        ResponseEntity<List<TaskDTO>> response = taskController.getAllTasks();

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(taskList, response.getBody());
        verify(taskService, times(1)).getAllTasks();
    }

    @Test
    void testCreateTask() {
        // Mock the service method
        when(taskService.createTask(taskDTO)).thenReturn(taskDTO);

        // Call the controller method
        ResponseEntity<TaskDTO> response = taskController.createTask(taskDTO);

        // Verify the response
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(taskDTO, response.getBody());
        verify(taskService, times(1)).createTask(taskDTO);
    }

    @Test
    void testUpdateTask() {
        Long taskId = 1L;

        // Mock the service method
        when(taskService.updateTask(taskId, taskDTO)).thenReturn(taskDTO);

        // Call the controller method
        ResponseEntity<TaskDTO> response = taskController.updateTask(taskId, taskDTO);

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(taskDTO, response.getBody());
        verify(taskService, times(1)).updateTask(taskId, taskDTO);
    }

    @Test
    void testDeleteTask() {
        Long taskId = 1L;

        // Mock the service method
        doNothing().when(taskService).deleteTask(taskId);

        // Call the controller method
        ResponseEntity<Void> response = taskController.deleteTask(taskId);

        // Verify the response
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(taskService, times(1)).deleteTask(taskId);
    }

    @Test
    void testGetAdminStats() {
        // Mock the service method
        Map<String, Object> adminStats = Map.of("totalTasks", 100, "completedTasks", 80);
        when(taskService.getAdminStats()).thenReturn(adminStats);

        // Call the controller method
        ResponseEntity<Map<String, Object>> response = taskController.getAdminStats();

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(adminStats, response.getBody());
        verify(taskService, times(1)).getAdminStats();
    }
}
