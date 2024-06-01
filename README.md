# ⭐️ [Scalable E-commerce Backend (Microservices)](https://roadmap.sh/projects/scalable-ecommerce-platform)

This project implements a scalable e-commerce backend using a microservices architecture, now primarily developed in TypeScript.

## Tech Stack

The core technologies employed in this project include:

- **TypeScript**: For robust, statically-typed application code.
- **Node.js**: As the JavaScript runtime environment.
- **Express.js**: For building RESTful APIs within each microservice.
- **MongoDB**: As the NoSQL database solution for all services.
- **Mongoose**: As the Object Data Mapper (ODM) for MongoDB.
- **Docker**: For containerizing each microservice, ensuring consistent deployment.
- **Nginx**: Utilized as an API Gateway and Load Balancer.
- **Kubernetes**: For orchestrating and managing containerized services in production (setup not included in this repo, but designed for it).
- **Stripe**: Integrated for payment processing.
- **JWT (JSON Web Tokens)** & **Argon2**: For authentication and password hashing.
- **Nodemailer & Twilio**: For email and SMS notifications.
- **Axios**: For inter-service HTTP communication.

## Project Structure

The backend is organized into several microservices, each located in its own directory at the root of the project (e.g., `/user-service`, `/product-service`). Each service includes:
- TypeScript source files (e.g., `index.ts`, route handlers, models, services).
- A `package.json` defining its dependencies and scripts.
- A `Dockerfile` for building its container image.
- An `.env.example` file listing required environment variables.

## Microservice Details

Below is a breakdown of each microservice, its purpose, key API endpoints, and required environment variables.

---

### 1. User Service
Manages user registration, authentication, and profiles. It handles user creation and login by issuing JWTs. This service is critical for securing the platform and managing user identities.

**Key API Endpoints (Base Path: `/api/users`):**
- `POST /register`: Registers a new user.
- `POST /login`: Logs in an existing user and returns a JWT.

**Environment Variables (`user-service/.env.example`):**
- `MONGO_URI`: MongoDB connection string for the user database.
- `JWT_SECRET`: Secret key for signing JWTs.
- `PORT`: Port on which the service listens (default: 5000).

---

### 2. Product Service
Handles product catalog management, including creating, retrieving, updating, and deleting product listings, managing categories, and tracking inventory.

**Key API Endpoints (Base Path: `/api/products`):**
- `POST /create`: Creates a new product.
- `GET /`: Retrieves all products.
- `GET /:id`: Retrieves a specific product by its ID.
- `PUT /:id`: Updates a specific product by its ID.
- `DELETE /:id`: Deletes a specific product by its ID.
- `PUT /:id/deduct`: Deducts stock for a product (used internally by Order Service).

**Environment Variables (`product-service/.env.example`):**
- `MONGO_URI`: MongoDB connection string for the product database.
- `PORT`: Port on which the service listens (default: 5001).

---

### 3. Shopping Cart Service
Manages users’ shopping carts. It allows adding items, viewing the cart, removing items, and updating item quantities. It interacts with the Product Service to validate product existence.

**Key API Endpoints (Base Path: `/api/cart`):**
- `POST /:userId/add`: Adds a product to the specified user's cart.
- `GET /:userId`: Retrieves the cart for the specified user.
- `DELETE /:userId/remove/:productId`: Removes a specific product from the user's cart.
- `PUT /:userId/update/:productId`: Updates the quantity of a specific product in the user's cart.

**Environment Variables (`shopping-cart-service/.env.example`):**
- `MONGO_URI`: MongoDB connection string for the shopping cart database.
- `PRODUCT_SERVICE_URI`: URL for the Product Service (e.g., `http://product-service:5001`).
- `PORT`: Port on which the service listens (default: 5002).

---

### 4. Order Service
Processes customer orders. This includes placing new orders, tracking order statuses, and managing order history. It interacts with the Product Service to check stock and deduct quantities.

**Key API Endpoints (Base Path: `/api/orders`):**
- `POST /:userId`: Places a new order for the specified user.
- `GET /:userId`: Retrieves all orders for the specified user.
- `GET /:userId/:orderId`: Retrieves a specific order by its ID for the user.
- `PUT /:orderId/status`: Updates the status of a specific order (e.g., "Shipped", "Delivered").

**Environment Variables (`order-service/.env.example`):**
- `MONGO_URI`: MongoDB connection string for the order database.
- `PRODUCT_SERVICE_URI`: URL for the Product Service (e.g., `http://product-service:5001`).
- `PORT`: Port on which the service listens (default: 5003).

---

### 5. Payment Service
Facilitates payment processing for orders by integrating with the Stripe payment gateway.

**Key API Endpoints (Base Path: `/api/payments`):**
- `POST /:orderId`: Processes a payment for the specified order using Stripe.
- `GET /:paymentId`: Retrieves a specific payment by its ID.
- `GET /order/:orderId`: Retrieves all payments associated with a specific order.

**Environment Variables (`payment-service/.env.example`):**
- `MONGO_URI`: MongoDB connection string for the payment database.
- `STRIPE_SECRET_KEY`: Your Stripe secret key for API authentication.
- `PORT`: Port on which the service listens (default: 5004).

---

### 6. Notification Service
Sends transactional email and SMS notifications to users for events like order confirmation, shipping updates, etc.

**Key API Endpoints (Base Path: `/api/notification`):**
- `POST /email`: Sends an email notification.
- `POST /sms`: Sends an SMS notification.

**Environment Variables (`notification-service/.env.example`):**
- `NODEMAILER_EMAIL`: Email address to send notifications from.
- `NODEMAILER_PASSWORD`: Password for the sender email account.
- `TWILIO_ACCOUNT_SID`: Twilio Account SID for SMS.
- `TWILIO_AUTH_TOKEN`: Twilio Auth Token for SMS.
- `TWILIO_PHONE_NUMBER`: Twilio phone number to send SMS from.
- `PORT`: Port on which the service listens (default: 5005).

---

## Architecture Overview

The system is designed with the following architectural principles:

- **Microservices Architecture**: Each service detailed above is an independently deployable TypeScript application with its own dedicated database, promoting separation of concerns and scalability.
- **API Gateway & Load Balancing**: `Nginx` serves as the entry point (API Gateway) to route client requests to the appropriate microservice and also performs load balancing across multiple instances of services.
- **Containerization**: `Docker` is employed to containerize each TypeScript microservice. The Dockerfiles are configured for multi-stage builds to compile TypeScript and create optimized production images.
- **Deployment**: `Kubernetes` is the chosen platform for deploying and managing the containerized services in a production environment, offering features like automated scaling, fault tolerance, and self-healing.
- **CI/CD Pipeline**: A `GitHub Actions` workflow automates the continuous integration and deployment process, now including steps for building, testing, and deploying the TypeScript services.
- **Database**: `MongoDB` is the database of choice for all microservices, offering schema flexibility and scalability. `Mongoose` is used as the Object Data Mapper (ODM) for interacting with MongoDB from the TypeScript code.
- **Authentication & Authorization**: Secure authentication is implemented using `JSON Web Tokens (JWT)`, and `Argon2` is used for robust password hashing within the User Service.

## Pre-requisites

To run or develop this project, you'll need:

- **Docker & Docker Compose**: Essential for running the services in a containerized environment.
  ```bash
  docker --version
  docker compose version
  ```
- **Node.js & npm (or Yarn)**: Required for local development, TypeScript compilation, and running linters/tests.
  ```bash
  node --version
  npm --version
  ```
- **Environment Variables**: Create and populate `.env` files with the necessary configuration values for each service as per their respective `.env.example` files (detailed under each service above).

## How to run the project using docker (Recommended)

The simplest way to get all services running is with Docker Compose:

```bash
docker compose up --build
```

The `--build` flag ensures that Docker images are rebuilt if there are any changes in the code or Dockerfiles (e.g., after TypeScript compilation changes).

## GitHub Actions (CI/CD) Requirements

For the CI/CD pipeline to successfully push Docker images to Docker Hub, ensure the following GitHub secrets are configured in your repository:

- `DOCKER_USERNAME`: Your Docker Hub username.
- `DOCKER_PASSWORD`: Your Docker Hub password or access token.

---


## Future Considerations

- **Service Discovery**: Implement a more robust service discovery mechanism (e.g., Consul, etcd) for dynamic environments.
- **Distributed Tracing**: Integrate distributed tracing (e.g., Jaeger, Zipkin) for better observability across microservices.
- **Message Queues**: Introduce message queues (e.g., RabbitMQ, Kafka) for asynchronous communication and improved resilience.
- **Testing**: Expand test coverage with more comprehensive integration and end-to-end tests for all services.
