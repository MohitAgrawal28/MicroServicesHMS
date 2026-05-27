package com.example.apigateway;

import java.security.Key;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final String secret;

    public JwtUtil(@Value("${jwt.secret:YourSuperSecretKeyForJWTTokenGeneration1234567890}") String secret) {
        this.secret = secret;
    }

    public void validateToken(final String token) {
        Jwts.parser()
            .setSigningKey(getSignKey())
            .build()
            .parseClaimsJws(token);
    }

    private Key getSignKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
