package com.studyspotfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.studyspotfinder.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // you can later add queries like findByEmail, findByUsername, etc.
}
