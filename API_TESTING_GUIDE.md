# E-commerce Backend API Testing Guide (Postman/Insomnia)

This guide provides a step-by-step sequence for testing the e-commerce backend API.

## Prerequisites

1.  **Application Running:** Ensure all microservices are running using `docker compose up --build`.
2.  **Base URL:** All API calls will use `http://localhost:80` as the base URL, which points to the Nginx API gateway.
3.  **JWT Token:** You will need a JSON Web Token (JWT) for authenticated endpoints. You obtain this by registering and/or logging in. Store this token as `YOUR_JWT_TOKEN`.
4.  **User ID:** Many endpoints require your `userId`.
    *   After getting `YOUR_JWT_TOKEN`, decode it using an online tool like `https://jwt.io/`.
    *   Paste your token into the "Encoded" field.
    *   In the "Decoded" section on the right, find the "PAYLOAD" data. It will contain a field like `"userId": "some_value"`. This `some_value` is `YOUR_USER_ID`.
    *   **Note:** On `jwt.io`, you might see an "Invalid Signature" warning if you haven't provided the `JWT_SECRET`. This is okay; the payload will still be decoded and visible.

## General Setup for Authenticated Requests

For API calls that require authentication:
*   **Header:** `Authorization`
*   **Value:** `Bearer YOUR_JWT_TOKEN` (Replace `YOUR_JWT_TOKEN` with your actual token)

---

## Test Sequence

**Important:** Replace placeholders like `YOUR_JWT_TOKEN`, `YOUR_USER_ID`, `YOUR_PRODUCT_ID_1`, etc., with actual values you obtain during testing.

### 1. User Service

**a. Register a New User**
*   **Method:** `POST`
*   **URL:** `http://localhost:80/api/users/register`
*   **Headers:** `Content-Type: application/json`
*   **Body:**
    ```json
    {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    }
    ```
*   **Expected Status:** `201 Created`
*   **Response:** Contains `token`.
    *   **ACTION:** Save this token as `YOUR_JWT_TOKEN`. Decode it to get `YOUR_USER_ID`.

**b. Login User**
*   **Method:** `POST`
*   **URL:** `http://localhost:80/api/users/login`
*   **Headers:** `Content-Type: application/json`
*   **Body:**
    ```json
    {
        "email": "testuser@example.com",
        "password": "password123"
    }
    ```
*   **Expected Status:** `200 OK`
*   **Response:** Contains `token`.
    *   **ACTION:** Update `YOUR_JWT_TOKEN` and `YOUR_USER_ID` if you run this.

---

### 2. Product Service
*(Requires `Authorization` header for create/update/delete)*

**a. Create Product 1**
*   **Method:** `POST`
*   **URL:** `http://localhost:80/api/products/create`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Body:**
    ```json
    {
        "name": "Laptop Pro X",
        "description": "High-performance laptop for professionals.",
        "price": 1599.99,
        "category": "Electronics",
        "stock": 25
    }
    ```
*   **Expected Status:** `201 Created`
*   **Response:** Product object.
    *   **ACTION:** Save the `_id` of this product as `YOUR_PRODUCT_ID_1`.

**b. Create Product 2**
*   **Method:** `POST`
*   **URL:** `http://localhost:80/api/products/create`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Body:**
    ```json
    {
        "name": "Wireless Ergonomic Mouse",
        "description": "Comfortable mouse for all-day use.",
        "price": 49.99,
        "category": "Accessories",
        "stock": 150
    }
    ```
*   **Expected Status:** `201 Created`
*   **Response:** Product object.
    *   **ACTION:** Save the `_id` of this product as `YOUR_PRODUCT_ID_2`.

**c. Get All Products**
*   **Method:** `GET`
*   **URL:** `http://localhost:80/api/products/`
*   **Headers:** (Authorization optional)
*   **Expected Status:** `200 OK`
*   **Response:** Array of products.

**d. Get Specific Product (Product 1)**
*   **Method:** `GET`
*   **URL:** `http://localhost:80/api/products/YOUR_PRODUCT_ID_1`
*   **Headers:** (Authorization optional)
*   **Expected Status:** `200 OK`
*   **Response:** Product 1 object.

---

### 3. Shopping Cart Service
*(Requires `Authorization` header and `YOUR_USER_ID` in URLs)*

**a. Add Product 1 to Cart**
*   **Method:** `POST`
*   **URL:** `http://localhost:80/api/cart/YOUR_USER_ID/add`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Body:**
    ```json
    {
        "productId": "YOUR_PRODUCT_ID_1",
        "quantity": 1
    }
    ```
*   **Expected Status:** `200 OK` (or `201`)
*   **Response:** Updated cart object.

**b. Add Product 2 to Cart**
*   **Method:** `POST`
*   **URL:** `http://localhost:80/api/cart/YOUR_USER_ID/add`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Body:**
    ```json
    {
        "productId": "YOUR_PRODUCT_ID_2",
        "quantity": 2
    }
    ```
*   **Expected Status:** `200 OK` (or `201`)
*   **Response:** Updated cart object.

**c. Get User's Cart**
*   **Method:** `GET`
*   **URL:** `http://localhost:80/api/cart/YOUR_USER_ID`
*   **Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Expected Status:** `200 OK`
*   **Response:** Cart object with items.

**d. Update Product 1 Quantity in Cart**
*   **Method:** `PUT`
*   **URL:** `http://localhost:80/api/cart/YOUR_USER_ID/update/YOUR_PRODUCT_ID_1`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Body:**
    ```json
    {
        "quantity": 3
    }
    ```
*   **Expected Status:** `200 OK`
*   **Response:** Updated cart object.

**e. Remove Product 2 from Cart**
*   **Method:** `DELETE`
*   **URL:** `http://localhost:80/api/cart/YOUR_USER_ID/remove/YOUR_PRODUCT_ID_2`
*   **Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Expected Status:** `200 OK`
*   **Response:** Updated cart object.

---

### 4. Order Service
*(Requires `Authorization` header and `YOUR_USER_ID`. Ensure cart has items, e.g., Product 1 is still in cart.)*

**a. Place New Order**
*   **Method:** `POST`
*   **URL:** `http://localhost:80/api/orders/YOUR_USER_ID`
*   **Headers:** `Authorization: Bearer YOUR_JWT_TOKEN` (Send `Content-Type: application/json` if body is not empty)
*   **Body:** `{}` (Typically processes the current cart)
*   **Expected Status:** `201 Created`
*   **Response:** Created order object.
    *   **ACTION:** Save the `_id` of this order as `YOUR_ORDER_ID`.

**b. Get User's Orders**
*   **Method:** `GET`
*   **URL:** `http://localhost:80/api/orders/YOUR_USER_ID`
*   **Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Expected Status:** `200 OK`
*   **Response:** Array of user's orders.

**c. Get Specific Order**
*   **Method:** `GET`
*   **URL:** `http://localhost:80/api/orders/YOUR_USER_ID/YOUR_ORDER_ID`
*   **Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Expected Status:** `200 OK`
*   **Response:** Specific order details.

**d. Update Order Status**
*   **Method:** `PUT`
*   **URL:** `http://localhost:80/api/orders/YOUR_ORDER_ID/status`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Body:**
    ```json
    {
        "status": "Shipped"
    }
    ```
*   **Expected Status:** `200 OK`
*   **Response:** Updated order object.

---

### 5. Payment Service
*(Requires `Authorization` header and `YOUR_ORDER_ID`)*

**a. Process Payment for Order**
*   **Method:** `POST`
*   **URL:** `http://localhost:80/api/payments/YOUR_ORDER_ID`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Body:** (This depends on your Stripe integration. For testing, a mock might use an empty body or a test payment method ID.)
    ```json
    {
        "paymentMethodId": "pm_card_visa" 
    }
    ```
*   **Expected Status:** `200 OK` or `201 Created`
*   **Response:** Payment confirmation.
    *   **ACTION:** Save payment `_id` (if returned) as `YOUR_PAYMENT_ID`.

**b. Get Payment Details** (If `YOUR_PAYMENT_ID` was obtained)
*   **Method:** `GET`
*   **URL:** `http://localhost:80/api/payments/YOUR_PAYMENT_ID`
*   **Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
*   **Expected Status:** `200 OK`
*   **Response:** Specific payment details.

---

### 6. Notification Service (Optional)
*(These endpoints might require specific `.env` configurations for email/SMS services to function fully. Authorization may or may not be implemented for these direct test endpoints.)*

**a. Send Email Notification**
*   **Method:** `POST`
*   **URL:** `http://localhost:80/api/notification/email`
*   **Headers:** `Content-Type: application/json`
*   **Body:**
    ```json
    {
        "to": "recipient@example.com",
        "subject": "API Test Email",
        "text": "This is a test email sent via API."
    }
    ```
*   **Expected Status:** `200 OK`

**b. Send SMS Notification**
*   **Method:** `POST`
*   **URL:** `http://localhost:80/api/notification/sms`
*   **Headers:** `Content-Type: application/json`
*   **Body:**
    ```json
    {
        "to": "+12345678900", 
        "body": "API Test SMS."
    }
    ```
*   **Expected Status:** `200 OK`

---

This guide should help you test the full application flow. Remember to substitute placeholders with actual data.
