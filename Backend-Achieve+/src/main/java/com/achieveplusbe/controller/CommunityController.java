package com.achieveplusbe.controller;

import com.achieveplusbe.dto.CommunityPostDTO;
import com.achieveplusbe.service.CommunityService;
import com.achieveplusbe.model.User;
import com.achieveplusbe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<CommunityPostDTO>> getAllPosts() {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(communityService.getAllPosts(currentUser.getId()));
    }

    @PostMapping
    public ResponseEntity<CommunityPostDTO> createPost(@RequestBody Map<String, String> payload) {
        User currentUser = getCurrentUser();
        String content = payload.get("content");
        return ResponseEntity.ok(communityService.createPost(currentUser.getId(), content));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<CommunityPostDTO> toggleLike(@PathVariable Long postId) {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(communityService.toggleLike(postId, currentUser.getId()));
    }



    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.getUserByEmail(email); // Assuming this method exists in UserService
    }
}
