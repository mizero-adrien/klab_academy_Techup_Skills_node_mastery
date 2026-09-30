# klab_academy_Techup_Skills_node_mastery

# KLab TechUp Skills — Ecommerce REST API (Express.js + TypeScript + MongoDB)

A REST API for a simple ecommerce platform, built with Node.js, Express.js, TypeScript, and MongoDB (via Mongoose). It supports product catalog management, category organization, user authentication, shopping carts, and order checkout.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Authentication & Roles](#authentication--roles)
- [Testing with Postman](#testing-with-postman)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Author](#author)

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| TypeScript | Static typing for JavaScript |
| Express.js | Web framework |
| MongoDB (Atlas) | Cloud NoSQL database |
| Mongoose | MongoDB object modeling (ODM) |
| jsonwebtoken | JWT-based authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |
| ts-node | Runs TypeScript directly without a separate build step |
| Nodemon | Restarts the server automatically on file changes |
| Postman | API testing |

## Prerequisites
- Node.js v18 or later
- npm (bundled with Node.js)
- A MongoDB Atlas account (free tier is sufficient)
- Postman (optional, for manual API testing)

Verify your installation:
```bash
node --version
npm --version
```

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd klab-techup-skills
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.example` to `.env` and fill in your own values (see [Environment Variables](#environment-variables) below).

### 4. Start the development server
```bash
npm run dev
```

On success, the console prints:
```
MongoDB is connected successfully
Example app listening on port 1000
```

The API is now available at `http://localhost:1000`. Nodemon watches the source files, so the server restarts automatically whenever you save a change in `src/`.

## Environment Variables

Create a `.env` file in the project root:

```
PORT=1000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_string
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (defaults to 1000 if unset) |
| `MONGODB_URI` | MongoDB Atlas connection string, including database name |
| `JWT_SECRET` | Secret used to sign and verify JWTs — keep this private |

`.env` is git-ignored; `.env.example` documents the required keys without real values.

## Project Structure

```
klab-techup-skills/
├── src/
│   ├── config/
│   │   └── db.ts                  # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.middleware.ts     # JWT verification + admin-only guard
│   ├── models/
│   │   ├── product.model.ts
│   │   ├── category.model.ts
│   │   ├── user.model.ts
│   │   ├── cart.model.ts
│   │   └── order.model.ts
│   ├── services/
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   ├── auth.service.ts
│   │   ├── cart.service.ts
│   │   └── order.service.ts
│   ├── controllers/
│   │   ├── product.controller.ts
│   │   ├── category.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── cart.controller.ts
│   │   └── order.controller.ts
│   ├── routes/
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── cart.routes.ts
│   │   └── order.routes.ts
│   └── server.ts                  # Application entry point
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Architecture

The API follows a layered architecture for separation of concerns:

```
Route → Controller → Service → Model → MongoDB
```

- **Route** — maps an HTTP method + URL to a controller function
- **Controller** — handles the HTTP request/response; calls the service
- **Service** — contains business logic; calls the model to read/write data
- **Model** — defines schema, validation rules, and the queryable interface to MongoDB

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server with Nodemon and ts-node |
| `npm run build` | Compiles TypeScript to JavaScript into `dist/` |
| `npm start` | Runs the compiled JavaScript from `dist/` (production) |

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Log in, returns JWT + user info |

### Categories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/categories` | Public | List all categories |
| GET | `/categories/:id` | Public | Get one category |
| POST | `/categories` | Admin | Create a category |
| PUT | `/categories/:id` | Admin | Update a category |
| DELETE | `/categories/:id` | Admin | Delete a category |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/products` | Public | List all products |
| GET | `/products?category=:id` | Public | Filter products by category |
| GET | `/products/:id` | Public | Get one product |
| POST | `/products` | Admin | Create a product |
| PUT | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Delete a product |

### Cart
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/cart` | Customer | View my cart |
| POST | `/cart` | Customer | Add a product to my cart |
| PUT | `/cart/:productId` | Customer | Update quantity of an item |
| DELETE | `/cart/:productId` | Customer | Remove an item from my cart |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/orders/checkout` | Customer | Create an order from my current cart |
| GET | `/orders` | Customer | List my past orders |
| GET | `/orders/:id` | Customer | Get one of my orders |
| PATCH | `/orders/:id/cancel` | Customer | Cancel one of my orders (only while `pending`) |

## Authentication & Roles

- Authentication uses **JWT**. After login, include the token on protected requests:
```
  Authorization: Bearer <token>
```
- Two roles exist: `customer` (default on registration) and `admin`.
- Admin-only routes (creating/updating/deleting products and categories) return `403 Forbidden` for non-admin users.
- Requests without a valid token on protected routes return `401 Unauthorized`.
- Passwords are hashed with bcrypt before storage; plain-text passwords are never stored or returned.

## Testing with Postman

1. Start the server with `npm run dev`.
2. Register a user via `POST /auth/register`.
3. Log in via `POST /auth/login` and copy the returned `token`.
4. Add the token as a Bearer token (Authorization tab, or a manual `Authorization: Bearer <token>` header) on any protected request.
5. To test admin-only routes, manually set a user's `role` to `admin` in MongoDB Atlas, then log in again for a fresh token.

## Troubleshooting

- **MongoDB connection fails / `bad auth`** — check `MONGODB_URI` in `.env`, confirm the database user's password is correct and URL-encoded if it contains special characters, and confirm your current IP is allowed under Atlas > Network Access.
- **`req.body` is always empty** — confirm `app.use(express.json())` is registered in `server.ts` before your routes, and that Postman's Body tab is set to raw + JSON.
- **`ts-node` crashes with a `fileExists` / internal TypeScript error** — usually a version mismatch; this project pins `typescript@5.4.5` and `ts-node@10.9.2` for compatibility.
- **404 on an update/delete request** — confirm the URL includes the resource's real `_id` (e.g. `/products/<id>`, not just `/products`).

<!-- {
  "name": "Jean Uwimana",
  "email": "jean.uwimana@example.com",
  "password": "Secret123!"
} -->
<!-- {
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with USB receiver",
  "price": 15.99,
  "stock": 25,
  "category": "<real category _id>"
} -->
<!-- {
  "name": "Clothing",
  "description": "Apparel and fashion items"
} -->

## Roadmap

- [x] Additional API routes (categories, products, auth, cart, orders)
- [x] Controller and service layers
- [x] Custom middleware (JWT auth, admin-only guard)
- [x] Environment variable configuration
- [x] Database integration (MongoDB Atlas + Mongoose)
- [ ] API documentation (Swagger / OpenAPI) — in progress
- [ ] Request validation
- [ ] Centralized error handling
- [ ] Automated tests

## Author

**Adrien Mizero**

GitHub: [mizero-adrien](https://github.com/mizero-adrien)