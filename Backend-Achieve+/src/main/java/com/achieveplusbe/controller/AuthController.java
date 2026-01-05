package com.achieveplusbe.controller;

import com.achieveplusbe.dto.AuthRequest;
import com.achieveplusbe.dto.AuthResponse;
import com.achieveplusbe.dto.UserDTO;
import com.achieveplusbe.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        logger.info("Login attempt for email: {}", request.getEmail());
        try {
            AuthResponse response = authService.login(request);
            logger.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for email: {}", request.getEmail(), e);
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody UserDTO userDTO) {
        logger.info("Registration attempt for email: {}", userDTO.getEmail());
        try {
            UserDTO registeredUser = authService.register(userDTO);
            logger.info("Registration successful for email: {}", userDTO.getEmail());
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Registration failed for email: {}", userDTO.getEmail(), e);
            throw e;
        }
    }
}