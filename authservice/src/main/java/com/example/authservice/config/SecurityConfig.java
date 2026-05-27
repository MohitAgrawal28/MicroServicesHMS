package com.example.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF since we use stateless, self-contained JWT tokens
            .csrf(csrf -> csrf.disable())
            
            // 2. Configure explicit path permissions
            .authorizeHttpRequests(auth -> auth
                // Allow public access to all authentication, registration, and testing endpoints
                .requestMatchers(
                    "/",
                    "/login", 
                    "/test", 
                    "/db-test",
                    "/auth/login", 
                    "/auth/register", 
                    "/auth/test",
                    "/auth/**"
                ).permitAll()
                
                // Any other internal administrative request must be authenticated
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
