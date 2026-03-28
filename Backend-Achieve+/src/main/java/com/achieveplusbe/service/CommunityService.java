package com.achieveplusbe.service;

import com.achieveplusbe.dto.CommunityPostDTO;
import com.achieveplusbe.model.CommunityPost;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.CommunityPostRepository;
import com.achieveplusbe.repository.UserRepository;
import com.achieveplusbe.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class CommunityService {

    @Autowired
    private CommunityPostRepository communityPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CommunityPostDTO> getAllPosts(Long currentUserId) {
        return communityPostRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(post -> mapToDTO(post, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public CommunityPostDTO createPost(Long userId, String content) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CommunityPost post = CommunityPost.builder()
                .content(content)
                .author(author)
                .build();

        CommunityPost savedPost = communityPostRepository.save(post);
        return mapToDTO(savedPost, userId);
    }

    @Transactional
    public CommunityPostDTO toggleLike(Long postId, Long userId) {
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (post.getLikedBy().contains(user)) {
            post.getLikedBy().remove(user);
        } else {
            post.getLikedBy().add(user);
        }

        CommunityPost savedPost = communityPostRepository.save(post);
        return mapToDTO(savedPost, userId);
    }

    private CommunityPostDTO mapToDTO(CommunityPost post, Long currentUserId) {
        boolean likedByCurrentUser = false;
        if (post.getLikedBy() != null) {
            // Check by ID to be safe if equals/hashcode relies on mutable fields or isn't perfect
            likedByCurrentUser = post.getLikedBy().stream()
                    .anyMatch(u -> u.getId().equals(currentUserId));
        }

        return CommunityPostDTO.builder()
                .id(post.getId())
                .content(post.getContent())
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getFullName())
                .createdAt(post.getCreatedAt())
                .likeCount(post.getLikedBy() == null ? 0 : post.getLikedBy().size())
                .likedByCurrentUser(likedByCurrentUser)
                .build();
    }
}
