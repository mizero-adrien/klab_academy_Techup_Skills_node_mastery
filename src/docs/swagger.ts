export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "KLab TechUp Skills Ecommerce API",
    version: "1.0.0",
    description: "REST API for a simple ecommerce platform: categories, products, auth, cart, and orders.",
  },
  servers: [{ url: "http://localhost:1000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Category: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
        },
      },
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          stock: { type: "number" },
          category: { type: "string" },
        },
      },
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
      },
      ForgotPasswordInput: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string" },
        },
      },
      ResetPasswordInput: {
        type: "object",
        required: ["password"],
        properties: {
          password: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": { description: "User created" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in and receive a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": { description: "Login successful, returns token and user" },
          "401": { description: "Invalid email or password" },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request a password reset email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ForgotPasswordInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Generic confirmation message (sent whether or not the email exists)",
          },
        },
      },
    },
    "/auth/reset-password/{token}": {
      post: {
        tags: ["Auth"],
        summary: "Reset password using a valid reset token",
        parameters: [
          { name: "token", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ResetPasswordInput" },
            },
          },
        },
        responses: {
          "200": { description: "Password reset successfully" },
          "400": { description: "Invalid or expired reset token" },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "List all categories",
        responses: { "200": { description: "List of categories" } },
      },
      post: {
        tags: ["Categories"],
        summary: "Create a category (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Category" },
            },
          },
        },
        responses: {
          "201": { description: "Category created" },
          "401": { description: "No token provided" },
          "403": { description: "Admin access required" },
        },
      },
    },
    "/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get one category by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Category found" }, "404": { description: "Not found" } },
      },
      put: {
        tags: ["Categories"],
        summary: "Update a category (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Category updated" }, "404": { description: "Not found" } },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete a category (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Category deleted" }, "404": { description: "Not found" } },
      },
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "List all products (optionally filter by category)",
        parameters: [
          { name: "category", in: "query", required: false, schema: { type: "string" } },
        ],
        responses: { "200": { description: "List of products" } },
      },
      post: {
        tags: ["Products"],
        summary: "Create a product (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        responses: {
          "201": { description: "Product created" },
          "401": { description: "No token provided" },
          "403": { description: "Admin access required" },
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get one product by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Product found" }, "404": { description: "Not found" } },
      },
      put: {
        tags: ["Products"],
        summary: "Update a product (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Product updated" }, "404": { description: "Not found" } },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete a product (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Product deleted" }, "404": { description: "Not found" } },
      },
    },
    "/cart": {
      get: {
        tags: ["Cart"],
        summary: "View my cart",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Cart returned" } },
      },
      post: {
        tags: ["Cart"],
        summary: "Add an item to my cart",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "number" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Item added" } },
      },
    },
    "/cart/{productId}": {
      put: {
        tags: ["Cart"],
        summary: "Update quantity of a cart item",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Cart updated" }, "404": { description: "Item not found" } },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove an item from my cart",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Item removed" } },
      },
    },
    "/orders/checkout": {
      post: {
        tags: ["Orders"],
        summary: "Create an order from my current cart",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Order created" }, "400": { description: "Cart is empty" } },
      },
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "List my past orders",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "List of orders" } },
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get one of my orders",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Order found" }, "404": { description: "Not found" } },
      },
    },
    "/orders/{id}/cancel": {
      patch: {
        tags: ["Orders"],
        summary: "Cancel one of my orders (only while pending)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Order cancelled" },
          "400": { description: "Only pending orders can be cancelled" },
          "404": { description: "Not found" },
        },
      },
    },
  },
};
