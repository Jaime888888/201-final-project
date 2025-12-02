package com.studyspotfinder;

import javax.sql.DataSource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.studyspotfinder.model.User;
import com.studyspotfinder.repository.UserRepository;

@SpringBootApplication
public class DemoApplication implements CommandLineRunner {

    private final DataSource dataSource;
    private final UserRepository userRepository;

    public DemoApplication(DataSource dataSource, UserRepository userRepository) {
        this.dataSource = dataSource;
        this.userRepository = userRepository;
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Testing DB connection...");

        try (var conn = dataSource.getConnection()) {
            System.out.println("Connected to DB successfully!");
            System.out.println("   URL: " + conn.getMetaData().getURL());
            System.out.println("   User: " + conn.getMetaData().getUserName());
        } catch (Exception e) {
            System.out.println("Failed to connect to the DB!");
            e.printStackTrace();
        }

        // ------------------------------
        // AUTO-CREATE MOCK USER ON EMPTY DB
        // ------------------------------
        long count = userRepository.count();
        System.out.println("User count in DB: " + count);

        if (count == 0) {
            System.out.println("No users found — creating mock user...");

            User mock = new User();
            mock.setUsername("testuser");
            mock.setEmail("test@example.com");
            mock.setPasswordHash("hashedpassword123");

            userRepository.save(mock);

            System.out.println("Mock user created!");
        } else {
            System.out.println("Users already exist — no mock user added.");
        }
    }
}
