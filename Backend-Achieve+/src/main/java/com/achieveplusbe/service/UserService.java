package com.achieveplusbe.service;

import com.achieveplusbe.dto.UserDTO;
import com.achieveplusbe.exception.ResourceNotFoundException;
import com.achieveplusbe.model.Role;
import com.achieveplusbe.model.Task;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getLeaderboardUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.ROLE_EMPLOYEE)  // Only include employees
                .map(this::convertToDTO)
                .sorted((a, b) -> b.getPoints().compareTo(a.getPoints()))  // Sort by points descending
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToDTO(user);
    }

    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .fullName(userDTO.getFullName())
                .role(Role.valueOf(userDTO.getRole()))
                .build();

        User savedUser = userRepository.save(user);

        userDTO.setId(savedUser.getId());
        userDTO.setPassword(null); // Clear password for security

        return userDTO;
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check if email is being changed and is already in use
        if (!user.getEmail().equals(userDTO.getEmail()) && userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        user.setEmail(userDTO.getEmail());
        user.setFullName(userDTO.getFullName());

        // Only update password if provided
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        // Update role if provided
        if (userDTO.getRole() != null && !userDTO.getRole().isEmpty()) {
            user.setRole(Role.valueOf(userDTO.getRole()));
        }

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        userRepository.delete(user);
    }

    private UserDTO convertToDTO(User user) {
        // Calculate total points from completed tasks
        int totalPoints = user.getAssignedTasks().stream()
                .filter(task -> task.getStatus() == Task.TaskStatus.COMPLETED)
                .mapToInt(Task::getPoints)
                .sum();

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .points(totalPoints)
                .build();
    }

}























//
//@Service
//@RequiredArgsConstructor
//public class UserService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public List<UserDTO> getAllUsers() {
//        return userRepository.findAll().stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    // Add this method for getting employees
//    public List<UserDTO> getAllEmployees() {
//        return userRepository.findByRole(Role.ROLE_EMPLOYEE).stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    public UserDTO getUserById(Long id) {
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
//        return convertToDTO(user);
//    }
//
//    @Transactional
//    public UserDTO createUser(UserDTO userDTO) {
//        if (userRepository.existsByEmail(userDTO.getEmail())) {
//            throw new RuntimeException("Email already in use");
//        }
//
//        User user = new User();
//        user.setEmail(userDTO.getEmail());
//        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
//        user.setFullName(userDTO.getFullName());
//        user.setRole(Role.valueOf(userDTO.getRole()));
//
//        User savedUser = userRepository.save(user);
//
//        userDTO.setId(savedUser.getId());
//        userDTO.setPassword(null); // Clear password for security
//
//        return userDTO;
//    }
//
//    @Transactional
//    public UserDTO updateUser(Long id, UserDTO userDTO) {
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
//
//        // Check if email is being changed and is already in use
//        if (!user.getEmail().equals(userDTO.getEmail()) && userRepository.existsByEmail(userDTO.getEmail())) {
//            throw new RuntimeException("Email already in use");
//        }
//
//        user.setEmail(userDTO.getEmail());
//        user.setFullName(userDTO.getFullName());
//
//        // Only update password if provided
//        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
//            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
//        }
//
//        // Update role if provided
//        if (userDTO.getRole() != null && !userDTO.getRole().isEmpty()) {
//            user.setRole(Role.valueOf(userDTO.getRole()));
//        }
//
//        User updatedUser = userRepository.save(user);
//        return convertToDTO(updatedUser);
//    }
//
//    @Transactional
//    public void deleteUser(Long id) {
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
//
//        userRepository.delete(user);
//    }
//
//    private UserDTO convertToDTO(User user) {
//        UserDTO dto = new UserDTO();
//        dto.setId(user.getId());
//        dto.setEmail(user.getEmail());
//        dto.setFullName(user.getFullName());
//        dto.setRole(user.getRole().name());
//        return dto;
//    }
//}