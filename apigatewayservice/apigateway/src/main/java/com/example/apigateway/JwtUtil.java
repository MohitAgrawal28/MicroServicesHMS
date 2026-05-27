package com.example.apigateway;

import java.security.Key;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // MUST be the raw secret key string used by Auth Service, NOT the generated token!
    public static final String SECRET = "YourSuperSecretKeyForJWTTokenGeneration1234567890";

    public void validateToken(final String token) {
        Jwts.parser()
            .setSigningKey(getSignKey())
            .build()
            .parseClaimsJws(token);
    }

    private Key getSignKey() {
        byte[] keyBytes = SECRET.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}