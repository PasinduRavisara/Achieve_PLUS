package com.achieveplusbe.config;

import com.achieveplusbe.model.Role;
import com.achieveplusbe.model.User;
import com.achieveplusbe.model.Task;
import com.achieveplusbe.model.Task.TaskStatus;
import com.achieveplusbe.repository.UserRepository;
import com.achieveplusbe.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 2) return; 

        // Admins
        createUser("Sarah Connor", "sarah@achieve.com", "password", Role.ROLE_ADMIN);
        createUser("Bruce Wayne", "bruce@achieve.com", "password", Role.ROLE_ADMIN);

        // Employees
        User john = createUser("John Doe", "john@achieve.com", "password", Role.ROLE_EMPLOYEE);
        User jane = createUser("Jane Smith", "jane@achieve.com", "password", Role.ROLE_EMPLOYEE);
        User peter = createUser("Peter Parker", "peter@achieve.com", "password", Role.ROLE_EMPLOYEE);
        User clark = createUser("Clark Kent", "clark@achieve.com", "password", Role.ROLE_EMPLOYEE);

        // Tasks
        createTask("Update landing page", "Refactor the hero section", "High", TaskStatus.PENDING, john);
        createTask("Fix login bug", "JWT token expiry issue", "High", TaskStatus.IN_PROGRESS, jane);
        createTask("Write documentation", "API docs for tasks endpoint", "Medium", TaskStatus.COMPLETED, peter);
        createTask("Design new logo", "Modernize the brand", "Low", TaskStatus.PENDING, clark);
        createTask("Database Optimization", "Index the users table", "High", TaskStatus.PENDING, john);
        createTask("Client Meeting", "Discuss Q3 goals", "Medium", TaskStatus.IN_PROGRESS, jane);
    }

    private User createUser(String name, String email, String password, Role role) {
        if(userRepository.findByEmail(email).isPresent()) return userRepository.findByEmail(email).get();
        return userRepository.save(User.builder()
                .fullName(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build());
    }

    private void createTask(String title, String desc, String priority, TaskStatus status, User user) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(desc);
        task.setPriority(priority);
        task.setStatus(status);
        task.setAssignedUser(user);
        task.setDueDate(LocalDate.now().plusDays(7));
        task.setPoints(50);
        taskRepository.save(task);
    }
}
