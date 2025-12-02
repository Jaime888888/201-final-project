package com.studyspotfinder.service;

import com.studyspotfinder.model.User;
import com.studyspotfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // place for auth logic later
    public User createUser(User user) {
        return userRepository.save(user);
    }
}
