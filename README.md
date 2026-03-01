# SwiftSavor - Food Ordering System

A complete production-ready microservices-based food ordering system built with Spring Boot, Spring Cloud, React, MySQL, and MongoDB.

## Architecture Overview

```
┌─────────────┐
│   Frontend  │ (React + Vite - Port 5173)
└──────┬──────┘
       │
┌──────▼──────────┐
│  API Gateway    │ (Port 8080)
└──────┬──────────┘
       │
┌──────▼──────────┐
│ Eureka Server   │ (Port 8761)
└─────────────────┘
       │
   ┌───┴───┬───────┬────────┬──────┬────────┐
   │       │       │        │      │        │
┌──▼──┐ ┌─▼──┐ ┌──▼───┐ ┌──▼──┐ ┌─▼────┐ ┌▼────┐
│Auth │ │User│ │Rest. │ │Order│ │Payment│ │...  │
│8081 │ │8082│ │ 8083 │ │8084 │ │ 8085  │ │     │
└─────┘ └────┘ └──────┘ └─────┘ └───────┘ └─────┘
  MySQL   MySQL   MySQL   MongoDB   MySQL
```

## Prerequisites

Make sure you have the following installed:

1. **Java 21** (Azul Zulu JDK 21.0.10 or later)
   ```powershell
   java -version
   ```

2. **Maven** (3.8+ recommended) - **OR use the included Maven Wrapper**
   ```powershell
   mvn -version
   ```
   > **Note:** If Maven is not installed, the project includes Maven Wrapper (`mvnw.cmd`) which will be used automatically.

3. **MySQL 8.x** (Running on localhost:3306)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Default root user with password

4. **MongoDB 4.x+** (Running on localhost:27017)
   - Download from: https://www.mongodb.com/try/download/community

5. **Node.js 18+** and npm
   ```powershell
   node -version
   npm -version
   ```

## Database Setup

### MySQL Databases

Open MySQL shell or MySQL Workbench and run:

```sql
-- Create databases
CREATE DATABASE swiftsavor_auth;
CREATE DATABASE swiftsavor_user;
CREATE DATABASE swiftsavor_restaurant;
CREATE DATABASE swiftsavor_payment;

-- Verify
SHOW DATABASES;
```

**Important:** Update `application.yml` in each service if your MySQL credentials differ:
```yaml
spring:
  datasource:
    username: root
    password: your_password
```

### MongoDB Database

MongoDB will automatically create the `swiftsavor_order` database when the Order Service starts. No manual setup needed.

To verify MongoDB is running:
```powershell
mongo --eval "db.version()"
```

## Project Structure

```
foodOrderingSystem/
├── eureka-server/          # Service Discovery (Port 8761)
├── api-gateway/           # API Gateway (Port 8080)
├── auth-service/          # Authentication (Port 8081)
├── user-service/          # User Management (Port 8082)
├── restaurant-service/    # Restaurant & Menu (Port 8083)
├── order-service/         # Orders & Cart (Port 8084)
├── payment-service/       # Payments (Port 8085)
└── frontend/             # React Application (Port 5173)
```

## Running the Application

### Step 1: Start Eureka Server (Discovery Service)

**Option A - If Maven is installed:**
```powershell
cd d:\PROJECTS\foodOrderingSystem\eureka-server
mvn clean install
mvn spring-boot:run
```

**Option B - Using Maven Wrapper (if mvn is not in PATH):**
```powershell
cd d:\PROJECTS\foodOrderingSystem\eureka-server
cmd /c mvnw.cmd clean install
cmd /c mvnw.cmd spring-boot:run
```

cmd /c mvnw.cmd
Verify: Open http://localhost:8761 in your browser to see the Eureka dashboard.

### Step 2: Start API Gateway

```powershell
cd d:\PROJECTS\foodOrderingSystem\api-gateway
cmd /c mvnw.cmd spring-boot:run
```

Wait for: `Tomcat started on port(s): 8080`

### Step 3: Start Microservices (Can run in parallel)

Open **5 separate PowerShell terminals** and run:

**Terminal 1 - Auth Service:**
```powershell
cd d:\PROJECTS\foodOrderingSystem\auth-service
cmd /c mvnw.cmd spring-boot:run
```

**Terminal 2 - User Service:**
```powershell
cd d:\PROJECTS\foodOrderingSystem\user-service
cmd /c mvnw.cmd spring-boot:run
```

**Terminal 3 - Restaurant Service:**
```powershell
cd d:\PROJECTS\foodOrderingSystem\restaurant-service
cmd /c mvnw.cmd spring-boot:run
```

**Terminal 4 - Order Service:**
```powershell
cd d:\PROJECTS\foodOrderingSystem\order-service
cmd /c mvnw.cmd spring-boot:run
```

**Terminal 5 - Payment Service:**
```powershell
cd d:\PROJECTS\foodOrderingSystem\payment-service
cmd /c mvnw.cmd spring-boot:run
```

### Step 4: Start Frontend

```powershell
cd d:\PROJECTS\foodOrderingSystem\frontend
npm install
npm run dev
```

Frontend will start on: http://localhost:5173

## Service Start Order (Important!)

Start services in this exact order for proper registration:

1. **Eureka Server** (8761) - Must be first
2. **API Gateway** (8080) - Should be second
3. **All Microservices** (8081-8085) - Can start in any order after Gateway
4. **Frontend** (5173) - Can start anytime after Gateway

## Verification Checklist

✅ **Eureka Dashboard**: http://localhost:8761
   - Should show: API-GATEWAY, AUTH-SERVICE, USER-SERVICE, RESTAURANT-SERVICE, ORDER-SERVICE, PAYMENT-SERVICE

✅ **Frontend**: http://localhost:5173
   - Home page should load

✅ **API Gateway Health**: http://localhost:8080/actuator/health
   - Should return: `{"status":"UP"}`

## Creating Test Data

### 1. Register Users

Open the frontend or use Postman:

**Customer Registration:**
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "customer1",
  "email": "customer1@test.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "1234567890",
  "address": "123 Main St",
  "role": "CUSTOMER"
}
```

**Restaurant Owner Registration:**
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "owner1",
  "email": "owner1@test.com",
  "password": "password123",
  "fullName": "Jane Smith",
  "phone": "0987654321",
  "address": "456 Business Ave",
  "role": "RESTAURANT_OWNER"
}
```

**Admin Registration:**
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@swiftsavor.com",
  "password": "admin123",
  "fullName": "Admin User",
  "phone": "1111111111",
  "address": "Admin Office",
  "role": "ADMIN"
}
```

### 2. Login

```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "owner1",
  "password": "password123"
}
```

Response will include a JWT token. Copy it.

### 3. Create a Restaurant (as Restaurant Owner)

```bash
POST http://localhost:8080/api/restaurants
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Pizza Paradise",
  "description": "Best pizzas in town!",
  "address": "789 Food Street",
  "phone": "5555555555",
  "cuisine": "Italian",
  "openingHours": "10:00 AM - 11:00 PM"
}
```

### 4. Add Food Items

```bash
POST http://localhost:8080/api/restaurants/{restaurantId}/items
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato, mozzarella, and basil",
  "price": 299.99,
  "category": "Pizza",
  "isVegetarian": true,
  "isAvailable": true
}
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### User Management (`/api/users`)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/all` - [Admin] Get all users

### Restaurants (`/api/restaurants`)
- `GET /api/restaurants/public` - Get all restaurants (public)
- `GET /api/restaurants/{id}` - Get restaurant by ID
- `POST /api/restaurants` - [Owner] Create restaurant
- `PUT /api/restaurants/{id}` - [Owner] Update restaurant
- `GET /api/restaurants/{id}/items` - Get food items
- `POST /api/restaurants/{id}/items` - [Owner] Add food item

### Orders (`/api/orders`)
- `GET /api/orders/cart` - Get current cart
- `POST /api/orders/cart` - Add item to cart
- `DELETE /api/orders/cart/{foodItemId}` - Remove item from cart
- `DELETE /api/orders/cart` - Clear cart
- `POST /api/orders` - Place order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/{id}` - Get order by ID

### Payments (`/api/payments`)
- `POST /api/payments/process` - Process payment (internal)
- `GET /api/payments/order/{orderId}` - Get payment by order ID

## Frontend Features

### Customer Flow
1. Browse restaurants at `/restaurants`
2. View menu items at `/restaurants/:id`
3. Add items to cart
4. View cart at `/cart`
5. Checkout at `/checkout`
6. Track order at `/orders/:id`
7. View all orders at `/orders`

### Restaurant Owner Flow
1. Access dashboard at `/owner`
2. Manage restaurants and menu items
3. View incoming orders

### Admin Flow
1. Access dashboard at `/admin`
2. View all users, restaurants, and orders
3. Manage system

## Troubleshooting

### Port Already in Use

If you see "Port already in use" error:

```powershell
# Find process using port (e.g., 8080)
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <process_id> /F
```

### Maven Wrapper Permission Error
Not Found Error

If you see "mvn is not recognized" error:

```powershell
# Use Maven Wrapper with cmd
cmd /c mvnw.cmd spring-boot:run

# This works because mvnw.cmd is included in each service directory
```

**Why use `cmd /c`?** PowerShell sometimes has issues running `.cmd` files directly. Using `cmd /c` runs the command through Command Prompt.
### Service Not Registering with Eureka

1. Ensure Eureka Server is running first
2. Check service logs for connection errors
3. Verify `application.yml` has correct Eureka URL:
   ```yaml
   eureka:
     client:
       serviceUrl:
         defaultZone: http://localhost:8761/eureka/
   ```

### Database Connection Issues

**MySQL:**
```powershell
# Test MySQL connection
mysql -u root -p
```

If connection fails:
- Check MySQL service is running
- Verify credentials in `application.yml`
- Ensure databases are created

**MongoDB:**
```powershell
# Check MongoDB status
net start MongoDB
```

### Frontend Cannot Connect to Backend

1. Verify API Gateway is running on port 8080
2. Check browser console for CORS errors
3. Ensure `vite.config.js` has correct proxy settings

### JWT Token Errors

If you get "Invalid token" errors:
1. Ensure JWT secret matches in API Gateway and Auth Service
2. Token expires after 24 hours - login again
3. Check token is being sent in Authorization header

## Production Considerations

For production deployment, consider:

1. **Security:**
   - Change JWT secret key
   - Use environment variables for credentials
   - Enable HTTPS
   - Implement rate limiting

2. **Database:**
   - Use connection pooling
   - Set up database replicas
   - Enable SSL connections

3. **Microservices:**
   - Add circuit breakers (Resilience4j)
   - Implement distributed tracing (Sleuth + Zipkin)
   - Add centralized logging (ELK stack)
   - Use configuration server (Spring Cloud Config)

4. **Deployment:**
   - Containerize with Docker
   - Use Kubernetes for orchestration
   - Set up CI/CD pipeline
   - Configure health checks and monitoring

## Technology Stack

- **Backend:** Java 21, Spring Boot 3.2.0, Spring Cloud 2023.0.0
- **Databases:** MySQL 8.x, MongoDB 4.x+
- **Security:** JWT, Spring Security, BCrypt
- **Service Discovery:** Netflix Eureka
- **API Gateway:** Spring Cloud Gateway
- **Frontend:** React 18, Vite 5, Tailwind CSS 3
- **Communication:** REST APIs, OpenFeign

## Notes

- Payment processing is **simulated** (90% success rate)
- Admin and Owner dashboards have basic layouts - implement features as needed
- All passwords are encrypted with BCrypt
- JWT tokens expire after 24 hours
- Cart is cleared after successful order placement
- Order statuses: PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED

## Support

For issues or questions:
1. Check service logs in the terminal
2. Verify all services are registered in Eureka dashboard
3. Check database connections
4. Review application.yml configurations

---

**Happy Coding! 🚀**
