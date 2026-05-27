package com.example.authservice.controller;

import com.example.authservice.model.User;
import com.example.authservice.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class AuthTestController {

    private final UserRepository userRepository;

    public AuthTestController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/db-test")
    public List<User> testDatabase() {
        // 1. Create and save a dummy user
        User dummy = new User();
        dummy.setUsername("test_user_" + System.currentTimeMillis());
        dummy.setEmail("test@hms.com");
        userRepository.save(dummy);

        // 2. Fetch all users from MySQL and return them
        return userRepository.findAll();
    }
}
