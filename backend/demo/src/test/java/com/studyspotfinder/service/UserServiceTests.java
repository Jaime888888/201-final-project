package com.studyspotfinder.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.studyspotfinder.model.User;
import com.studyspotfinder.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class UserServiceTests {
    @Test
    void registrationHashesThePasswordBeforeSaving() {
        UserRepository repository = mock(UserRepository.class);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(4);
        when(repository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        UserService service = new UserService(repository, encoder);

        User saved = service.registerUser("student", "student@example.com", "strong-password");

        assertEquals("student", saved.getUsername());
        assertEquals("student@example.com", saved.getEmail());
        assertNotEquals("strong-password", saved.getPasswordHash());
        assertTrue(encoder.matches("strong-password", saved.getPasswordHash()));
        verify(repository).save(saved);
    }
}
