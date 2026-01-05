package com.achieveplusbe.test;

import com.achieveplusbe.controller.UserController;
import com.achieveplusbe.dto.UserDTO;
import com.achieveplusbe.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private UserDTO userDTO;
    private List<UserDTO> userList;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
        userDTO = new UserDTO("test@example.com", "password123", "User", "User");
        userList = Arrays.asList(userDTO);
    }

    @Test
    void testGetAllUsers() {
        // Mock the service method
        when(userService.getAllUsers()).thenReturn(userList);

        // Call the controller method
        ResponseEntity<List<UserDTO>> response = userController.getAllUsers();

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userList, response.getBody());
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void testGetUserById() {
        Long userId = 1L;

        // Mock the service method
        when(userService.getUserById(userId)).thenReturn(userDTO);

        // Call the controller method
        ResponseEntity<UserDTO> response = userController.getUserById(userId);

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userDTO, response.getBody());
        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    void testCreateUser() {
        // Mock the service method
        when(userService.createUser(userDTO)).thenReturn(userDTO);

        // Call the controller method
        ResponseEntity<UserDTO> response = userController.createUser(userDTO);

        // Verify the response
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(userDTO, response.getBody());
        verify(userService, times(1)).createUser(userDTO);
    }

    @Test
    void testUpdateUser() {
        Long userId = 1L;

        // Mock the service method
        when(userService.updateUser(userId, userDTO)).thenReturn(userDTO);

        // Call the controller method
        ResponseEntity<UserDTO> response = userController.updateUser(userId, userDTO);

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userDTO, response.getBody());
        verify(userService, times(1)).updateUser(userId, userDTO);
    }

    @Test
    void testDeleteUser() {
        Long userId = 1L;

        // Mock the service method
        doNothing().when(userService).deleteUser(userId);

        // Call the controller method
        ResponseEntity<Void> response = userController.deleteUser(userId);

        // Verify the response
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(userService, times(1)).deleteUser(userId);
    }
}

