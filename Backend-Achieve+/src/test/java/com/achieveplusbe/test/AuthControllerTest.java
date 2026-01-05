package com.achieveplusbe.test;

import com.achieveplusbe.controller.AuthController;
import com.achieveplusbe.dto.AuthRequest;
import com.achieveplusbe.dto.AuthResponse;
import com.achieveplusbe.dto.UserDTO;
import com.achieveplusbe.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private AuthRequest authRequest;
    private AuthResponse authResponse;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);  // Initialize mocks
        // Mocking input data
        authRequest = new AuthRequest("test@example.com", "password123");
        authResponse = new AuthResponse("token123");
        userDTO = new UserDTO("test@example.com", "password123", "User", "User");
    }

    @Test
    void testLoginSuccess() {
        // Mocking service method
        when(authService.login(authRequest)).thenReturn(authResponse);

        // Calling the controller method
        ResponseEntity<AuthResponse> response = authController.login(authRequest);

        // Verifying the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(authResponse, response.getBody());
        verify(authService, times(1)).login(authRequest);
    }

    @Test
    void testLoginFailure() {
        // Mocking service method to throw exception
        when(authService.login(authRequest)).thenThrow(new RuntimeException("Invalid credentials"));

        // Calling the controller method and expecting an exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authController.login(authRequest);
        });

        assertEquals("Invalid credentials", exception.getMessage());
        verify(authService, times(1)).login(authRequest);
    }

    @Test
    void testRegisterSuccess() {
        // Mocking service method
        when(authService.register(userDTO)).thenReturn(userDTO);

        // Calling the controller method
        ResponseEntity<UserDTO> response = authController.register(userDTO);

        // Verifying the response
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(userDTO, response.getBody());
        verify(authService, times(1)).register(userDTO);
    }

    @Test
    void testRegisterFailure() {
        // Mocking service method to throw exception
        when(authService.register(userDTO)).thenThrow(new RuntimeException("Registration failed"));

        // Calling the controller method and expecting an exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authController.register(userDTO);
        });

        assertEquals("Registration failed", exception.getMessage());
        verify(authService, times(1)).register(userDTO);
    }
}
