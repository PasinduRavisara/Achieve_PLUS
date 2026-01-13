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
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.count() == 0) {
                List<User> users = Arrays.asList(
                    createUser("pasindu", "pasindu@gmail.com", "password", Role.Admin, 1250),
                    createUser("Ravisara", "ravisara@gmail.com", "password", Role.Employee, 980),
                    createUser("Sarah Connor", "sarah@achieve.com", "password", Role.Admin, 1100),
                    createUser("Bruce Wayne", "bruce@achieve.com", "password", Role.Admin, 2400),
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

    private void seedTasks(List<User> users) {
        User admin = users.stream().filter(u -> u.getRole() == Role.Admin).findFirst().orElse(users.get(0));
        User employee = users.stream().filter(u -> u.getRole() == Role.Employee).findFirst().orElse(users.get(1));
        
        List<Task> tasks = Arrays.asList(
            createTask("Complete Project Proposal", "Draft and submit the Q4 project proposal.", "High", Task.TaskStatus.IN_PROGRESS, 50, admin, employee, LocalDate.now().plusDays(2)),
            createTask("Review Code PRs", "Review pending pull requests for the backend service.", "Medium", Task.TaskStatus.PENDING, 30, admin, employee, LocalDate.now().plusDays(1)),
            createTask("Update Documentation", "Update the API documentation with recent changes.", "Low", Task.TaskStatus.COMPLETED, 20, admin, employee, LocalDate.now().minusDays(1)),
            createTask("Client Meeting Prep", "Prepare slides for the upcoming client meeting.", "High", Task.TaskStatus.PENDING, 40, admin, admin, LocalDate.now().plusDays(3)),
            createTask("Fix Login Bug", "Investigate and fix the reported login issue on mobile.", "High", Task.TaskStatus.IN_PROGRESS, 60, admin, employee, LocalDate.now().plusDays(5))
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
