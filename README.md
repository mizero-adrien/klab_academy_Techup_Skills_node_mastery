# klab_academy_Techup_Skills_node_mastery

# KLab TechUp Skills — Ecommerce REST API (Express.js + TypeScript + MongoDB)

A REST API for a simple ecommerce platform, built with Node.js, Express.js, TypeScript, and MongoDB (via Mongoose). It supports product catalog management with image uploads, category organization, user authentication with email notifications and password reset, shopping carts, and order checkout.

**Live API:** https://klab-academy-techup-skills-api.onrender.com
**Interactive docs:** https://klab-academy-techup-skills-api.onrender.com/api-docs

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
- [Email Notifications](#email-notifications)
- [Image Uploads](#image-uploads)
- [Testing with Postman](#testing-with-postman)
- [Deployment](#deployment)
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
| Cloudinary | Image storage and CDN delivery |
| Multer | Multipart file upload handling |
| Brevo (HTTP API) | Transactional email delivery |
| Swagger / OpenAPI | Interactive API documentation |
| cors | Cross-origin request support |
| dotenv | Environment variable management |
| ts-node | Runs TypeScript directly without a separate build step |
| Nodemon | Restarts the server automatically on file changes |
| Render | Cloud hosting / deployment |
| Postman | API testing |

## Prerequisites
- Node.js v18 or later
- npm (bundled with Node.js)
- A MongoDB Atlas account (free tier is sufficient)
- A Cloudinary account (free tier is sufficient)
- A Brevo account (free tier is sufficient)
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
API docs available at http://localhost:1000/api-docs
```

The API is now available at `http://localhost:1000`. Nodemon watches the source files, so the server restarts automatically whenever you save a change in `src/`.

## Environment Variables

Create a `.env` file in the project root:

```
PORT=1000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=your_verified_sender_email
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (defaults to 1000 if unset; Render assigns its own automatically) |
| `MONGODB_URI` | MongoDB Atlas connection string, including database name |
| `JWT_SECRET` | Secret used to sign and verify JWTs — keep this private |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Credentials for uploading and serving product images |
| `BREVO_API_KEY` | API key for sending transactional emails via Brevo's HTTP API |
| `EMAIL_FROM` | Verified sender address emails are sent from |

`.env` is git-ignored; `.env.example` documents the required keys without real values. When deploying, these must also be set in your hosting provider's dashboard (e.g. Render's **Environment** tab) — a `.env` file is never read in production.

## Project Structure

```
klab-techup-skills/
├── src/
│   ├── config/
│   │   ├── db.ts                  # MongoDB connection setup
│   │   ├── cloudinary.ts          # Cloudinary SDK configuration
│   │   └── mailer.ts              # Brevo client configuration
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT verification + admin-only guard
│   │   └── upload.middleware.ts   # Multer file upload handling
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
│   ├── templates/
│   │   ├── welcomeEmail.template.ts
│   │   ├── orderConfirmation.template.ts
│   │   └── passwordReset.template.ts
│   ├── utils/
│   │   ├── cloudinaryUpload.ts     # Uploads a file buffer to Cloudinary
│   │   └── sendEmail.ts           # Sends an email via Brevo
│   ├── docs/
│   │   └── swagger.ts             # OpenAPI spec for /api-docs
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
- **Service** — contains business logic; calls the model to read/write data, and triggers emails where relevant
- **Model** — defines schema, validation rules, and the queryable interface to MongoDB
- **Templates** — build email HTML content, kept separate from business logic
- **Config/Utils** — shared setup (database, Cloudinary, email) and reusable helpers used across services

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
| POST | `/auth/register` | Public | Register a new user (sends a welcome email) |
| POST | `/auth/login` | Public | Log in, returns JWT + user info |
| POST | `/auth/forgot-password` | Public | Request a password reset email |
| POST | `/auth/reset-password/:token` | Public | Reset password using a valid, unexpired token |

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
| POST | `/products` | Admin | Create a product (accepts an `image` file via form-data) |
| PUT | `/products/:id` | Admin | Update a product (optionally replace the image) |
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
| POST | `/orders/checkout` | Customer | Create an order from my current cart (sends an order confirmation email) |
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

### Forgot / reset password flow
1. `POST /auth/forgot-password` with `{ "email": "..." }`. A generic confirmation is returned whether or not the email exists, to prevent account enumeration.
2. If the email matches a user, a random token is generated, stored on the user record with a 15-minute expiry, and emailed as a reset link.
3. `POST /auth/reset-password/:token` with `{ "password": "newPassword" }` sets the new password if the token is valid and unexpired, then clears the token so it cannot be reused.

## Email Notifications

Transactional emails are sent via **Brevo's HTTP API** (not SMTP), since outbound SMTP connections are blocked on some free hosting tiers, including Render's. Email sending is **non-blocking**: a failed email is logged but never prevents the underlying action (registration, checkout, password reset request) from succeeding.

| Email | Triggered by |
|---|---|
| Welcome email | Successful registration |
| Order confirmation | Successful checkout |
| Password reset link | `POST /auth/forgot-password` |

Templates live in `src/templates/` as typed TypeScript functions (not a separate templating engine), so template content stays fully type-checked.

## Image Uploads

Product images are uploaded via `multipart/form-data` (not JSON) on `POST /products` and `PUT /products/:id`, under the field name `image`. Multer receives the file in memory, and it is streamed directly to Cloudinary, which returns a permanent CDN-hosted URL stored as the product's `imageUrl`. Only image files up to 5MB are accepted.

## Testing with Postman

1. Start the server with `npm run dev`.
2. Register a user via `POST /auth/register`.
3. Log in via `POST /auth/login` and copy the returned `token`.
4. Add the token as a Bearer token (Authorization tab, or a manual `Authorization: Bearer <token>` header) on any protected request.
5. To test admin-only routes, manually set a user's `role` to `admin` in MongoDB Atlas, then log in again for a fresh token.
6. To test product creation with an image, set the request Body to **form-data** (not raw JSON), with text fields plus an `image` key set to type **File**.

## Deployment

The API is deployed on **Render** as a Web Service.

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- All environment variables from `.env.example` must be set in Render's **Environment** tab — `PORT` is excluded, since Render assigns its own automatically and the app reads it via `process.env.PORT`.
- MongoDB Atlas **Network Access** must allow connections from anywhere (`0.0.0.0/0`) for Render's servers to connect.
- CORS is enabled (`app.use(cors())`) so the API can be called from browsers and from the deployed Swagger docs page.
- Render's free tier spins down after inactivity; the first request after idling may take up to a minute to respond.

## Troubleshooting

- **MongoDB connection fails / `bad auth`** — check `MONGODB_URI` in `.env`, confirm the database user's password is correct and URL-encoded if it contains special characters, and confirm your current IP is allowed under Atlas > Network Access.
- **`req.body` is always empty** — confirm `app.use(express.json())` is registered in `server.ts` before your routes, and that Postman's Body tab is set to raw + JSON (use form-data instead for file uploads).
- **`ts-node` crashes with a `fileExists` / internal TypeScript error** — usually a version mismatch; this project pins `typescript@5.4.5` and `ts-node@10.9.2` for compatibility.
- **404 on an update/delete request** — confirm the URL includes the resource's real `_id` (e.g. `/products/<id>`, not just `/products`).
- **Emails not sending in production but working locally** — outbound SMTP is often blocked on free hosting tiers; this project uses Brevo's HTTP API specifically to avoid that issue.
- **"Failed to fetch" / CORS error in Swagger UI** — ensure `app.use(cors())` is present in `server.ts` and the Swagger `servers` entry points to the correct deployed URL.
- **`must supply api_key` (Cloudinary) or similar missing-credential errors** — ensure the relevant config file (`cloudinary.ts`, `mailer.ts`) calls `dotenv.config()` itself, since import order can cause environment variables to load after the config file runs.

<!-- Sample request bodies for quick testing
{
  "name": "Jean Uwimana",
  "email": "jean.uwimana@example.com",
  "password": "Secret123!"
}
{
  "name": "Clothing",
  "description": "Apparel and fashion items"
}
-->

## Roadmap

- [x] Additional API routes (categories, products, auth, cart, orders)
- [x] Controller and service layers
- [x] Custom middleware (JWT auth, admin-only guard, file upload)
- [x] Environment variable configuration
- [x] Database integration (MongoDB Atlas + Mongoose)
- [x] API documentation (Swagger / OpenAPI)
- [x] Product image uploads (Cloudinary)
- [x] Email notifications (welcome, order confirmation, password reset)
- [x] Deployment (Render)
- [ ] Request validation
- [ ] Centralized error handling
- [ ] Automated tests

## Author

**Adrien Mizero**
GitHub: [mizero-adrien](https://github.com/mizero-adrien)