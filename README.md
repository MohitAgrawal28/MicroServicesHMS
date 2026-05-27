# MediTrack

MediTrack is a Hospital Management System built with a microservices architecture. The project uses Spring Boot services for backend capabilities, Eureka for service discovery, an API Gateway for routing and JWT validation, MySQL for persistence, and a React + Vite frontend for the user interface.

## Project Overview

MediTrack is organized as independent services that communicate through service discovery and gateway routing.

```text
React Frontend
      |
      v
API Gateway :8080
      |
      +-- Auth Service :8081
      |
      +-- Patient Service :8082
      |
      v
Eureka Server :8761
```

## Services

| Service | Folder | Port | Responsibility |
| --- | --- | --- | --- |
| Eureka Server | `eurekaserver` | `8761` | Service registry for backend services |
| API Gateway | `apigatewayservice/apigateway` | `8080` | Routes frontend requests and protects patient routes with JWT |
| Auth Service | `authservice` | `8081` | Authenticates users and generates JWT tokens |
| Patient Service | `patientservice` | `8082` | Manages patient records in MySQL |
| Frontend | `hms-frontend` | `5173` | React dashboard for login and patient management |

## Tech Stack

- Java 17
- Spring Boot
- Spring Cloud Netflix Eureka
- Spring Cloud Gateway
- Spring Security
- JWT using `jjwt`
- Spring Data JPA
- MySQL
- React
- Vite
- Axios

## Current Features

- Eureka service discovery
- API Gateway routing
- JWT-based login
- Protected patient APIs
- Patient listing
- Add patient by name and disease
- Frontend session reset on page refresh
- Responsive MediTrack dashboard UI

## Repository Structure

```text
MicroServicesHMS/
  apigatewayservice/
    apigateway/
  authservice/
  eurekaserver/
  patientservice/
  hms-frontend/
```

## Prerequisites

Install these before running the project:

- Java 17
- MySQL Server
- Node.js and npm
- Git

The backend services use Maven Wrapper, so a separate Maven installation is not required.

## Database Setup

Start MySQL and make sure the configured user can create/update databases.

Current local configuration:

```properties
spring.datasource.username=root
spring.datasource.password=agrawalmm_3
```

Auth database:

```text
hms_auth_db
```

Patient database:

```text
hms_patient
```

Both services use Hibernate `ddl-auto=update`, so tables are created/updated automatically when the services start.

## Running The Project

## Running With Docker

Docker Compose can start the complete system with one command:

- MySQL
- Eureka Server
- Auth Service
- Patient Service
- API Gateway
- React frontend

Make sure Docker Desktop is running, then run this from the repository root:

```bash
docker compose up --build
```

Open the app:

```text
Frontend: http://localhost:5173
Gateway:  http://localhost:8080
Eureka:   http://localhost:8761
```

Stop all containers:

```bash
docker compose down
```

Stop all containers and remove the MySQL volume:

```bash
docker compose down -v
```

Inside Docker, services communicate by Compose service name instead of `localhost`.

Examples:

```text
Eureka client URL: http://eureka-server:8761/eureka/
MySQL URL: jdbc:mysql://mysql:3306/hms_patient
```

The frontend still calls the gateway through:

```text
http://localhost:8080
```

because the browser runs on your host machine and the gateway port is exposed by Docker.

## Running Manually

Run services in this order.

### 1. Eureka Server

```bash
cd eurekaserver
./mvnw spring-boot:run
```

On Windows:

```bash
cd eurekaserver
mvnw.cmd spring-boot:run
```

Eureka dashboard:

```text
http://localhost:8761
```

### 2. Auth Service

```bash
cd authservice
./mvnw spring-boot:run
```

On Windows:

```bash
cd authservice
mvnw.cmd spring-boot:run
```

Health check:

```text
http://localhost:8081/test
```

### 3. Patient Service

```bash
cd patientservice
./mvnw spring-boot:run
```

On Windows:

```bash
cd patientservice
mvnw.cmd spring-boot:run
```

Health check:

```text
http://localhost:8082/test
```

### 4. API Gateway

```bash
cd apigatewayservice/apigateway
./mvnw spring-boot:run
```

On Windows:

```bash
cd apigatewayservice/apigateway
mvnw.cmd spring-boot:run
```

Gateway auth test:

```text
http://localhost:8080/auth/test
```

### 5. Frontend

```bash
cd hms-frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

or:

```text
http://127.0.0.1:5173
```

## Login Credentials

The current test login is hardcoded in `AuthService`.

```text
Username: mohit
Password: password123
```

After login, the frontend stores the JWT for the current page session. Refreshing the page clears the token and requires login again.

## API Routes

Use gateway routes from the frontend.

### Auth Routes

| Method | Gateway URL | Description |
| --- | --- | --- |
| `GET` | `/auth/test` | Checks Auth Service through gateway |
| `POST` | `/auth/login` | Logs in and returns JWT |

Login request body:

```json
{
  "username": "mohit",
  "password": "password123"
}
```

### Patient Routes

Patient routes are protected by the gateway. Send a bearer token.

| Method | Gateway URL | Description |
| --- | --- | --- |
| `GET` | `/patients/patient-db-test` | Returns all patients |
| `POST` | `/patients/patient-db-test` | Adds a patient |

Patient request body:

```json
{
  "name": "Asha Kumar",
  "disease": "Migraine"
}
```

Authorization header:

```text
Authorization: Bearer <jwt-token>
```

## Gateway Routing

The API Gateway routes requests as follows:

```properties
/auth/**     -> AUTHSERVICE
/patients/** -> PATIENT-SERVICE
```

The `/patients/**` route is protected by `AuthenticationFilter`, which validates JWT tokens before forwarding requests to Patient Service.

## CORS

The gateway allows the frontend origins:

```text
http://localhost:5173
http://127.0.0.1:5173
```

## Useful Test Commands

Login through the gateway:

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"mohit\",\"password\":\"password123\"}"
```

Get patients with JWT:

```bash
curl http://localhost:8080/patients/patient-db-test \
  -H "Authorization: Bearer <jwt-token>"
```

Add patient with JWT:

```bash
curl -X POST http://localhost:8080/patients/patient-db-test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d "{\"name\":\"Reena\",\"disease\":\"TB\"}"
```

## Frontend Scripts

Inside `hms-frontend`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

- Start Eureka before the other backend services.
- Start API Gateway after Auth Service and Patient Service.
- MySQL must be running before starting Auth Service and Patient Service.
- Use gateway URLs from the frontend, not direct backend service URLs.
- If patient APIs return `401`, login again and use the latest JWT token.

## Future Improvements

- Add proper user registration
- Replace hardcoded login with database-backed authentication
- Add patient update and delete operations
- Add role-based access control
- Add appointment, doctor, and billing services
- Add centralized configuration service
- Add backend and frontend test suites
