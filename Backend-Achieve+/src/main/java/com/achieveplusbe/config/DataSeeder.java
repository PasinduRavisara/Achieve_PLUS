package com.achieveplusbe.config;

import com.achieveplusbe.model.Role;
import com.achieveplusbe.model.Reward;
import com.achieveplusbe.model.Task;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.RewardRepository;
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
    private final RewardRepository rewardRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.achieveplusbe.repository.CommunityPostRepository communityPostRepository;

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

            List<User> users;
            if (userRepository.count() == 0) {
                users = Arrays.asList(
                    createUser("pasindu", "pasindu@gmail.com", "password", Role.Admin, 0),
                    createUser("Ravisara", "ravisara@gmail.com", "password", Role.Employee, 980),
                    createUser("Sarah Connor", "sarah@achieve.com", "password", Role.Admin, 0),
                    createUser("Bruce Wayne", "bruce@achieve.com", "password", Role.Admin, 0),
                    createUser("John Doe", "john@achieve.com", "password", Role.Employee, 450),
                    createUser("Jane Smith", "jane@achieve.com", "password", Role.Employee, 670),
                    createUser("Peter Parker", "peter@achieve.com", "password", Role.Employee, 890),
                    createUser("Clark Kent", "clark@achieve.com", "password", Role.Employee, 1500)
                );

                users = userRepository.saveAll(users);
                System.out.println("Users seeded successfully!");
                
                seedTasks(users);
                seedRewards();
            } else {
                users = userRepository.findAll();
            }
            
            seedCommunityPosts(users);
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
            createTask("Mobile App MVP", "Release the beta version.", "Critical", Task.TaskStatus.COMPLETED, 350, admin, users.get(7), LocalDate.now().minusDays(5)), // Clark
            createTask("Legacy System Audit", "Audit the old legacy system for security holes.", "Medium", Task.TaskStatus.OVERDUE, 90, admin, employee, LocalDate.now().minusDays(10)),
            createTask("Q3 Financial Report", "Prepare the financial report for Q3.", "High", Task.TaskStatus.OVERDUE, 150, admin, employee, LocalDate.now().minusDays(5))
        );

        taskRepository.saveAll(tasks);
        System.out.println("Tasks seeded successfully!");
    }

    private User createUser(String fullName, String email, String password, Role role, Integer points) {
        String baseName = fullName.toLowerCase().replaceAll("\\s+", "");
        String candidateName = baseName;
        int count = 1;
        while (userRepository.existsByUserName(candidateName)) {
            candidateName = baseName + count;
            count++;
        }

        return User.builder()
                .fullName(fullName)
                .userName(candidateName)
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

    @SuppressWarnings("null")
    private void seedRewards() {
        if (rewardRepository.count() == 0) {
            List<Reward> rewards = Arrays.asList(
                createReward("Amazon Gift Card", "A $50 gift card for Amazon.", 500, 50, "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Amazon_icon.png/1024px-Amazon_icon.png"),
                createReward("Netflix Subscription", "1 Month Netflix Premium Subscription.", 300, 30, "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg"),
                createReward("Spotify Premium", "3 Months Spotify Premium.", 400, 40, "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"),
                createReward("Extra Day Off", "One extra paid leave day.", 1000, 10, "https://cdn-icons-png.flaticon.com/512/2662/2662503.png"),
                createReward("Uber Eats Voucher", "$20 Voucher for Uber Eats.", 200, 100, "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Uber_Eats_2020_logo.svg/2560px-Uber_Eats_2020_logo.svg.png")
            );
            rewardRepository.saveAll(rewards);
            System.out.println("Rewards seeded successfully!");
        }
    }

    private Reward createReward(String name, String description, Integer pointsCost, Integer quantity, String imageUrl) {
        return Reward.builder()
                .name(name)
                .description(description)
                .pointsCost(pointsCost)
                .quantity(quantity)
                .imageUrl(imageUrl)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
    
    @SuppressWarnings("null")
    private void seedCommunityPosts(List<User> users) {
        if (communityPostRepository.count() == 0 && !users.isEmpty()) {
            User pasindu = users.get(0);
            User ravisara = users.get(1);
            User sarah = users.get(2);
            User bruce = users.get(3);
            User john = users.get(4);
            User jane = users.get(5);
            User peter = users.get(6);
            User clark = users.get(7);
            
            List<com.achieveplusbe.model.CommunityPost> posts = Arrays.asList(
                createPost("So proud of the team for hitting our Q3 targets early! @everyone", pasindu, LocalDateTime.now().minusHours(2)),
                createPost("Big thanks to @janesmith for helping me with the frontend bugs today. You're a lifesaver! \uD83D\uDE4C", john, LocalDateTime.now().minusHours(5)),
                createPost("Just finished the new API documentation. Check it out team!", sarah, LocalDateTime.now().minusDays(1)),
                createPost("Does anyone have a spare monitor adapter? Mine just died.", peter, LocalDateTime.now().minusDays(1)),
                createPost("Welcome to the team @clarkkent! Glad to have you on board.", bruce, LocalDateTime.now().minusDays(2)),
                createPost("Happy Birthday @ravisara! Hope you have a fantastic day! \uD83C\uDF82\uD83C\uDF89", pasindu, LocalDateTime.now().minusDays(2)),
                createPost("The new coffee machine in the break room is amazing. Highly recommend the cappuccino.", jane, LocalDateTime.now().minusDays(3)),
                createPost("Great job on the presentation today @brucewayne. Very insightful.", ravisara, LocalDateTime.now().minusDays(3)),
                createPost("Reminder: All timesheets are due by Friday 5 PM. Don't forget! @everyone", pasindu, LocalDateTime.now().minusDays(4)),
                createPost("Can we get a workshop on the new security protocols? I think it would be helpful.", clark, LocalDateTime.now().minusDays(5))
            );
            
            communityPostRepository.saveAll(posts);
            System.out.println("Community posts seeded successfully!");
        }
    }
    
    private com.achieveplusbe.model.CommunityPost createPost(String content, User author, LocalDateTime createdAt) {
        return com.achieveplusbe.model.CommunityPost.builder()
                .content(content)
                .author(author)
                .createdAt(createdAt)
                .build();
    }
}
