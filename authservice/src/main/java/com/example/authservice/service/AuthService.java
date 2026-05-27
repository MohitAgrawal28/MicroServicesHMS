package com.example.authservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private JwtUtil jwtUtil;

    public String test() {
        return "Auth Service Running";
    }

    public String loginUser(String username, String password) {
        // Simple hardcoded check for testing. Feel free to swap this out later with real DB validation!
        if ("mohit".equals(username) && "password123".equals(password)) {
            // Generate token string using our JwtUtil helper
            return jwtUtil.generateToken(username);
        } else {
            throw new RuntimeException("Invalid credentials entered!");
        }
    }
}
