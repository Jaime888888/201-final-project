package com.studyspotfinder.security;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.studyspotfinder.model.User;
import com.studyspotfinder.repository.UserRepository;
import com.studyspotfinder.security.JwtService;

@Service
public class AuthTokenUserResolver {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthTokenUserResolver(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    /**
     * Resolves a User from a JWT token if the token is valid.
     * Assumes the token's 'sub' is the user's email. If you use userId instead,
     * swap the lookup accordingly.
     */
    public Optional<User> resolveUser(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return Optional.empty();
        }
        String token = bearerToken.substring(7);
        try {
            String subject = jwtService.extractSubject(token);
            // Verify token integrity/expiration
            if (!jwtService.isTokenValid(token, subject)) {
                return Optional.empty();
            }
            // Lookup by email; if you store userId in sub, use findById(Long.parseLong(subject))
            return userRepository.findByEmail(subject);
        } catch (Exception ex) {
            return Optional.empty();
        }
    }
}