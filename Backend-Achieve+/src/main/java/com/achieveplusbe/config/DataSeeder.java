package com.achieveplusbe.config;

import com.achieveplusbe.model.Role;
import com.achieveplusbe.model.Task;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.TaskRepository;
import com.achieveplusbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @SuppressWarnings("null")
    public CommandLineRunner initData() {
        return args -> {
            // Always ensure Admins have 0 points (Fix for existing data)
            userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.Admin && u.getPoints() > 0)
                .forEach(u -> {
                    u.setPoints(0);
                    userRepository.save(u);
                    System.out.println("Reset points for Admin: " + u.getFullName());
                });

            if (userRepository.count() == 0) {
                List<User> users = Arrays.asList(
                    createUser("pasindu", "pasindu@gmail.com", "password", Role.Admin, 0),
                    createUser("Ravisara", "ravisara@gmail.com", "password", Role.Employee, 980),
                    createUser("Sarah Connor", "sarah@achieve.com", "password", Role.Admin, 0),
                    createUser("Bruce Wayne", "bruce@achieve.com", "password", Role.Admin, 0),
                    createUser("John Doe", "john@achieve.com", "password", Role.Employee, 450),
                    createUser("Jane Smith", "jane@achieve.com", "password", Role.Employee, 670),
                    createUser("Peter Parker", "peter@achieve.com", "password", Role.Employee, 890),
                    createUser("Clark Kent", "clark@achieve.com", "password", Role.Employee, 1500)
                );

                List<User> savedUsers = userRepository.saveAll(users);
                System.out.println("Users seeded successfully!");
                
                seedTasks(savedUsers);
            }
        };
    }

    @SuppressWarnings("null")
    private void seedTasks(List<User> users) {
        User admin = users.stream().filter(u -> u.getRole() == Role.Admin).findFirst().orElse(users.get(0));
        User employee = users.stream().filter(u -> u.getRole() == Role.Employee).findFirst().orElse(users.get(1));
        
        List<Task> tasks = Arrays.asList(
            createTask("Complete Project Proposal", "Draft and submit the Q4 project proposal.", "High", Task.TaskStatus.IN_PROGRESS, 50, admin, employee, LocalDate.now().plusDays(2)),
            createTask("Review Code PRs", "Review pending pull requests for the backend service.", "Medium", Task.TaskStatus.PENDING, 30, admin, employee, LocalDate.now().plusDays(1)),
            createTask("Update Documentation", "Update the API documentation with recent changes.", "Low", Task.TaskStatus.COMPLETED, 85, admin, employee, LocalDate.now().minusDays(1)),
            createTask("Client Meeting Prep", "Prepare slides for the upcoming client meeting.", "High", Task.TaskStatus.PENDING, 40, admin, admin, LocalDate.now().plusDays(3)),
            createTask("Fix Login Bug", "Investigate and fix the reported login issue on mobile.", "High", Task.TaskStatus.IN_PROGRESS, 60, admin, employee, LocalDate.now().plusDays(5)),
            createTask("Design System Update", "Refine the color palette.", "Medium", Task.TaskStatus.COMPLETED, 120, admin, users.get(5), LocalDate.now().minusDays(2)), // Jane
            createTask("Backend Optimization", "Improve database query performance.", "High", Task.TaskStatus.COMPLETED, 200, admin, users.get(4), LocalDate.now().minusDays(3)), // John
            createTask("Mobile App MVP", "Release the beta version.", "Critical", Task.TaskStatus.COMPLETED, 350, admin, users.get(7), LocalDate.now().minusDays(5)) // Clark
        );

        taskRepository.saveAll(tasks);
        System.out.println("Tasks seeded successfully!");
    }

    private User createUser(String fullName, String email, String password, Role role, Integer points) {
        return User.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .points(points)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private Task createTask(String title, String description, String priority, Task.TaskStatus status, Integer points, User createdBy, User assignedTo, LocalDate dueDate) {
        return Task.builder()
                .title(title)
                .description(description)
                .priority(priority)
                .status(status)
                .points(points)
                .createdBy(createdBy)
                .assignedUser(assignedTo)
                .dueDate(dueDate)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
