package com.achieveplusbe.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class AuthResponse {
    private Long id;
    private String token;
    private String role;
    private String fullName;
    private String email;

    public AuthResponse() {
    }

    public AuthResponse(Long id, String role, String token, String fullName, String email) {
        this.id = id;
        this.token = token;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
    }
    //for unit testing
    public AuthResponse(String token123) {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}