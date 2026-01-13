package com.achieveplusbe.config;

import com.achieveplusbe.model.Role;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.count() == 0) {
                List<User> users = Arrays.asList(
                    createUser("pasindu", "pasindu@gmail.com", "password", Role.Admin),
                    createUser("Ravisara", "ravisara@gmail.com", "password", Role.Employee),
                    createUser("Sarah Connor", "sarah@achieve.com", "password", Role.Admin),
                    createUser("Bruce Wayne", "bruce@achieve.com", "password", Role.Admin),
                    createUser("John Doe", "john@achieve.com", "password", Role.Employee),
                    createUser("Jane Smith", "jane@achieve.com", "password", Role.Employee),
                    createUser("Peter Parker", "peter@achieve.com", "password", Role.Employee),
                    createUser("Clark Kent", "clark@achieve.com", "password", Role.Employee)
                );

                userRepository.saveAll(users);
                System.out.println("Users seeded successfully!");
            }
        };
    }

    private User createUser(String fullName, String email, String password, Role role) {
        return User.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
