package com.studyspotfinder.demo;

import javax.sql.DataSource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication implements CommandLineRunner {

    private final DataSource dataSource;

    public DemoApplication(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔍 Testing DB connection...");

        try (var conn = dataSource.getConnection()) {
            System.out.println("✅ Connected to DB successfully!");
            System.out.println("   URL: " + conn.getMetaData().getURL());
            System.out.println("   User: " + conn.getMetaData().getUserName());
        } catch (Exception e) {
            System.out.println("❌ Failed to connect to the DB!");
            e.printStackTrace();
        }
    }
}