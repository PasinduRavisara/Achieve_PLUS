FROM maven:3.9.6-eclipse-temurin-17-alpine

WORKDIR /app

# Copy pom.xml to resolve dependencies
COPY pom.xml ./

# Install dos2unix to ensure line endings in scripts are proper if used
RUN apk add --no-cache dos2unix tzdata

# Copy the rest of the application
COPY src ./src

# Expose port 8080
EXPOSE 8080

# For local development within docker, we can just run spring-boot:run
CMD ["mvn", "spring-boot:run"]
