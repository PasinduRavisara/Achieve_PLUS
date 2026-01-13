package com.achieveplusbe.service;

import com.achieveplusbe.model.Notification;
import com.achieveplusbe.model.User;
import com.achieveplusbe.model.Role;
import com.achieveplusbe.repository.NotificationRepository;
import com.achieveplusbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createNotification(User recipient, String message, String type, Long relatedId) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedId(relatedId);
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void notifyAllEmployees(String message, String type, Long relatedId) {
        List<User> users = userRepository.findAll();
        users.stream()
             .filter(u -> u.getRole() == Role.Employee)
             .forEach(u -> createNotification(u, message, type, relatedId));
    }
    
    @Transactional
    public void notifyAdmin(String message, String type, Long relatedId) {
        List<User> users = userRepository.findAll();
        users.stream()
             .filter(u -> u.getRole() == Role.Admin)
             .forEach(u -> createNotification(u, message, type, relatedId));
    }

    public List<Notification> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        notificationRepository.save(n);
    }
    
    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<Notification> list = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
        list.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(list);
    }
}
