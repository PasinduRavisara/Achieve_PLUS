package com.achieveplusbe.repository;

import com.achieveplusbe.model.Task;
import com.achieveplusbe.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedUser(User user);
    List<Task> findByStatus(Task.TaskStatus status);
    List<Task> findByAssignedUserAndStatus(User user, Task.TaskStatus status);
    List<Task> findByCreatedBy(User user);

    long countByStatus(Task.TaskStatus status);
    long countByAssignedUserAndStatus(User user, Task.TaskStatus status);
}