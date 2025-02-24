# E-commerce Store API

## 📌 Overview
This is a RESTful API for an **E-commerce Store** built using **Node.js, Express, and MongoDB**. It includes a **user authentication system** where tokens are stored inside **HTTP cookies** for secure client-server communication. Users can **register, log in, log out, update their profile and password, manage products, reviews, and orders**.

---

## 🚀 Features
- **User Authentication** (Register, Login, Logout) with **JWT tokens stored in cookies**
- **User Profile Management** (Update Info & Password)
- **Product Management** (CRUD Operations & Reviews)
- **Order Management** (Place, Update, and View Orders)
- **Secure Routes** (Protected Endpoints using JWT & Middleware)

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, HTTP Cookies, Bcrypt.js
- **Middleware:** Express Middleware, CORS, Morgan
- **Security:** Helmet, Express-Rate-Limit, Express-Mongo-Sanitize

---

## 📦 Installation & Setup
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/RofixWork/ecommerce_store_api.git
   ```
2. **Install Dependencies:**
   ```sh
   npm install
   ```
3. **Create a `.env` file and add the following:**
   ```env
   LOCAL_PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_LIFETIME=your_token_lifetime
   ```
4. **Run the Server:**
   ```sh
   npm run dev
   ```

---

## 📍 API Endpoints

### 🔹 Authentication
| Method | Endpoint       | Description               |
|--------|---------------|---------------------------|
| POST   | `/api/v1/auth/register` | Register a new user |
| POST   | `/api/v1/auth/login`    | Log in and get token |
| GET    | `/api/v1/auth/logout`   | Log out and clear token |

### 🔹 User Profile
| Method | Endpoint         | Description |
|--------|-----------------|-------------|
| GET    | `/api/v1/users/me` | Get user profile |
| PATCH    | `/api/v1/users/update` | Update user info |
| PATCH    | `/api/v1/users/update-password` | Update password |

### 🔹 Product Management
| Method | Endpoint             | Description |
|--------|---------------------|-------------|
| GET    | `/api/v1/products`     | Get all products |
| POST   | `/api/v1/products`     | Create a product (Admin) |
| GET    | `/api/v1/products/:id` | Get product details |
| PATCH  | `/api/v1/products/:id` | Update a product (Admin) |
| DELETE | `/api/v1/products/:id` | Delete a product (Admin) |
| POST   | `/api/v1/products/upload-image` | Upload product image (Admin) |
| GET    | `/api/v1/products/:id/reviews` | Get product reviews |

### 🔹 Reviews
| Method | Endpoint               | Description |
|--------|-----------------------|-------------|
| GET    | `/api/v1/reviews` | Get all reviews |
| POST   | `/api/v1/reviews` | Create a review (Authenticated Users) |
| GET    | `/api/v1/reviews/:id` | Get review details |
| PATCH  | `/api/v1/reviews/:id` | Update a review (Authenticated Users) |
| DELETE | `/api/v1/reviews/:id` | Delete a review (Authenticated Users) |

### 🔹 Orders
| Method | Endpoint       | Description |
|--------|---------------|-------------|
| GET    | `/api/v1/orders` | Get all orders (Admin) |
| POST   | `/api/v1/orders` | Place an order (Authenticated Users) |
| GET    | `/api/v1/orders/show-all-my-orders` | Get all user orders |
| GET    | `/api/v1/orders/:id` | Get order details |
| PATCH  | `/api/v1/orders/:id` | Update an order |

---

## 🔒 Security & Middleware
- **Helmet** - Adds security headers
- **CORS** - Handles cross-origin requests
- **Express-Mongo-Sanitize** - Prevents NoSQL injection
- **Rate-Limiting** - Limits API requests

---

## ✅ Contribution
Feel free to fork this repository and submit pull requests. Contributions are welcome!

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 📩 Contact
For inquiries, reach out to **wourkout123@gmail.com**

Happy Coding! 🚀

