package com.studyspotfinder.controller;

import com.studyspotfinder.model.User;
import com.studyspotfinder.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // enable Next.js frontend
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // POST create user (temporary — before authentication is implemented)
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
}
