package com.achieveplusbe.controller;

import com.achieveplusbe.dto.UserDTO;
import com.achieveplusbe.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/leaderboard")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserDTO>> getLeaderboardUsers() {
        return ResponseEntity.ok(userService.getLeaderboardUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        return new ResponseEntity<>(userService.createUser(userDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(id, userDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

















































































































//
//@RestController
//@RequestMapping("/api/users")  // Changed to match your API path pattern
//@RequiredArgsConstructor
//@PreAuthorize("hasAuthority('ROLE_ADMIN')")  // Changed from hasRole to hasAuthority
//public class UserController {
//
//    private final UserService userService;
//
//    @GetMapping("/employees")
//    public ResponseEntity<List<UserDTO>> getEmployees() {
//        return ResponseEntity.ok(userService.getAllEmployees());
//    }
//
//    @GetMapping
//    public ResponseEntity<List<UserDTO>> getAllUsers() {
//        return ResponseEntity.ok(userService.getAllUsers());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
//        return ResponseEntity.ok(userService.getUserById(id));
//    }
//
//    @PostMapping
//    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
//        return new ResponseEntity<>(userService.createUser(userDTO), HttpStatus.CREATED);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<UserDTO> updateUser(
//            @PathVariable Long id,
//            @Valid @RequestBody UserDTO userDTO) {
//        return ResponseEntity.ok(userService.updateUser(id, userDTO));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
//        userService.deleteUser(id);
//        return ResponseEntity.noContent().build();
//    }
//}