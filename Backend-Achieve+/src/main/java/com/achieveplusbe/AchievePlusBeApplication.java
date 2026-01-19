package com.achieveplusbe;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AchievePlusBeApplication {

    public static void main(String[] args) {
        // Load .env file
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        // Set system properties for Spring to pick up
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        // Check if critical variables are loaded
        if (System.getProperty("DB_USERNAME") == null && System.getenv("DB_USERNAME") == null) {
            System.out.println("\n");
            System.out.println("=========================================================================");
            System.out.println("   ERROR: MISSING CONFIGURATION");
            System.out.println("=========================================================================");
            System.out.println("   No .env file found and no Environment Variables set.");
            System.out.println("   Please Create a .env file in the root directory: " + System.getProperty("user.dir"));
            System.out.println("   ");
            System.out.println("   Required contents:");
            System.out.println("   DB_URL=jdbc:mysql://<db_host>:<db_port>/<db_name>");
            System.out.println("   DB_USERNAME=<db_user>");
            System.out.println("   DB_PASSWORD=<db_password>");
            System.out.println("   JWT_SECRET=<your_jwt_secret>");
            System.out.println("   FRONTEND_URL=<frontend_url>");
            System.out.println("=========================================================================");
            System.out.println("\n");
            System.exit(1);
        }

        SpringApplication.run(AchievePlusBeApplication.class, args);
    }

}
