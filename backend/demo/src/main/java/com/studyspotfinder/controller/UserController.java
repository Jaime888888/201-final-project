package com.studyspotfinder.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize; // added

import com.studyspotfinder.model.User;
import com.studyspotfinder.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // enables frontend access; auth is handled by Jwt filter
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET all users (secured)
    @PreAuthorize("hasRole('USER')") // added
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // POST create user (secured)
    @PreAuthorize("hasRole('USER')") // added
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
}