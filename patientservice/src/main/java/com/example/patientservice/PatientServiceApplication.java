package com.example.patientservice;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PatientServiceApplication {
    public static void main(String[] args) {
        configureDatabaseUrl();
        SpringApplication.run(PatientServiceApplication.class, args);
    }

    private static void configureDatabaseUrl() {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank() || System.getenv("SPRING_DATASOURCE_URL") != null) {
            return;
        }

        if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) {
            URI uri = URI.create(databaseUrl);
            String[] userInfo = uri.getUserInfo() == null ? new String[0] : uri.getUserInfo().split(":", 2);
            int port = uri.getPort() == -1 ? 5432 : uri.getPort();

            System.setProperty("spring.datasource.url",
                    "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath());
            System.setProperty("spring.datasource.username", decode(userInfo.length > 0 ? userInfo[0] : ""));
            System.setProperty("spring.datasource.password", decode(userInfo.length > 1 ? userInfo[1] : ""));
            System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
        }
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
