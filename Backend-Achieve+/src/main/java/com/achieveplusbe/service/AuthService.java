package com.achieveplusbe.service;

import com.achieveplusbe.dto.AuthRequest;
import com.achieveplusbe.dto.AuthResponse;
import com.achieveplusbe.dto.UserDTO;
import com.achieveplusbe.exception.EmailAlreadyExistsException;
import com.achieveplusbe.model.Role;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.UserRepository;
import com.achieveplusbe.security.JwtTokenProvider;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthService(
            UserRepository userRepository,
            UserService userService,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(
                user.getId(),
                user.getRole().name(),
                token,
                user.getFullName(),
                user.getEmail());
    }

    @Transactional
    public UserDTO register(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new EmailAlreadyExistsException("Email already in use");
        }

        User user = new User();
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setUserName(userService.generateUniqueUserName(userDTO.getFullName()));
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(Role.valueOf(userDTO.getRole())); // Ensure frontend sends correct role string or handle logic here

        userRepository.save(user);

        // Return without password
        userDTO.setPassword(null);
        return userDTO;
    }
}