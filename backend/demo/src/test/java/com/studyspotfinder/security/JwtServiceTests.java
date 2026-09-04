package com.studyspotfinder.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class JwtServiceTests {
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "test-only-signing-key-with-at-least-32-characters");
        ReflectionTestUtils.setField(jwtService, "expirationHours", 1L);
    }

    @Test
    void generatedTokenRoundTripsAndValidatesItsSubject() {
        String token = jwtService.generateToken("student@example.com");

        assertEquals("student@example.com", jwtService.extractSubject(token));
        assertTrue(jwtService.isTokenValid(token, "student@example.com"));
        assertFalse(jwtService.isTokenValid(token, "different@example.com"));
    }
}
