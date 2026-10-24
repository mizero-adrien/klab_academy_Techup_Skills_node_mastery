export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "KLab TechUp Skills Ecommerce API",
    version: "1.0.0",
    description: "REST API for a simple ecommerce platform: categories, products, auth, cart, and orders.",
  },
  servers: [
    { url: "https://klab-academy-techup-skills-api.onrender.com" },
    { url: "http://localhost:1000" },
  ],
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
          imageUrl: { type: "string" },
          productCount: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CategoryInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          image: { type: "string", format: "binary" },
        },
      },
      CategoryUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          image: { type: "string", format: "binary" },
        },
      },
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          oldPrice: { type: "number" },
          stock: { type: "number" },
          category: { type: "string" },
          imageUrl: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductFormInput: {
        type: "object",
        required: ["name", "price", "category"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          stock: { type: "number" },
          category: { type: "string", description: "A real category _id" },
          image: { type: "string", format: "binary" },
        },
      },
      ProductUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          stock: { type: "number" },
          category: { type: "string", description: "A real category _id" },
          image: { type: "string", format: "binary" },
        },
      },
      CartQuantityInput: {
        type: "object",
        required: ["quantity"],
        properties: {
          quantity: { type: "number", minimum: 1 },
        },
      },
      CartItem: {
        type: "object",
        properties: {
          product: { $ref: "#/components/schemas/Product" },
          quantity: { type: "number", minimum: 1 },
        },
      },
      Cart: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      DeliveryInput: {
        type: "object",
        required: ["fullName", "phone", "address", "city"],
        properties: {
          fullName: { type: "string", minLength: 2, maxLength: 100 },
          phone: { type: "string", minLength: 9, maxLength: 13 },
          address: { type: "string", minLength: 5, maxLength: 200 },
          city: { type: "string", minLength: 2, maxLength: 50 },
        },
      },
      OrderInputItem: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "string", description: "A real product _id" },
          quantity: { type: "number", minimum: 1, maximum: 100 },
        },
      },
      CreateOrderInput: {
        type: "object",
        required: ["items", "delivery", "paymentMethod"],
        properties: {
          items: {
            type: "array",
            minItems: 1,
            maxItems: 50,
            items: { $ref: "#/components/schemas/OrderInputItem" },
          },
          delivery: { $ref: "#/components/schemas/DeliveryInput" },
          paymentMethod: { type: "string", enum: ["momo", "cash"] },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          product: { type: "string" },
          quantity: { type: "number" },
          priceAtPurchase: { type: "number" },
          productName: { type: "string" },
          productImage: { type: "string" },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          userName: { type: "string" },
          userEmail: { type: "string" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
          totalAmount: { type: "number" },
          status: {
            type: "string",
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
          },
          delivery: { $ref: "#/components/schemas/DeliveryInput" },
          paymentMethod: { type: "string", enum: ["momo", "cash"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UpdateOrderStatusInput: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
          },
        },
      },
      AdminOrderList: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/Order" },
          },
          total: { type: "number" },
          page: { type: "number" },
          limit: { type: "number" },
          statusCounts: {
            type: "object",
            properties: {
              pending: { type: "number" },
              paid: { type: "number" },
              shipped: { type: "number" },
              delivered: { type: "number" },
              cancelled: { type: "number" },
            },
          },
          totalRevenue: { type: "number" },
          pendingOrders: { type: "number" },
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
          "409": { description: "An account with this email already exists" },
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
        summary: "Create a category with an optional image (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CategoryInput" },
            },
          },
        },
        responses: {
          "201": { description: "Category created" },
          "400": { description: "Validation error or invalid image" },
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
        summary: "Update a category, optionally replacing its image (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CategoryUpdateInput" },
            },
          },
        },
        responses: {
          "200": { description: "Category updated" },
          "400": { description: "Validation error or invalid image" },
          "401": { description: "No token provided" },
          "403": { description: "Admin access required" },
          "404": { description: "Not found" },
        },
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
        summary: "Create a product with an optional image (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/ProductFormInput" },
            },
          },
        },
        responses: {
          "201": { description: "Product created" },
          "400": { description: "Validation error or invalid image" },
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
        summary: "Update a product, optionally replacing its image (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/ProductUpdateInput" },
            },
          },
        },
        responses: {
          "200": { description: "Product updated" },
          "400": { description: "Validation error or invalid image" },
          "404": { description: "Not found" },
        },
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
                  quantity: { type: "number", minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Item added" },
          "400": { description: "Product not found or validation error" },
          "401": { description: "No token provided" },
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Empty my cart",
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Cart cleared" },
          "401": { description: "No token provided" },
        },
      },
    },
    "/cart/{productId}": {
      put: {
        tags: ["Cart"],
        summary: "Update quantity of a cart item",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CartQuantityInput" },
            },
          },
        },
        responses: {
          "200": { description: "Cart updated" },
          "401": { description: "No token provided" },
          "404": { description: "Cart or item not found" },
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove an item from my cart",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Item removed" } },
      },
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "List my past orders, newest first",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "List of orders" } },
      },
      post: {
        tags: ["Orders"],
        summary: "Place an order from a list of items",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderInput" },
            },
          },
        },
        responses: {
          "201": { description: "Order created" },
          "400": { description: "Validation error or unknown product" },
          "401": { description: "No token provided" },
          "404": { description: "User not found" },
          "409": { description: "Insufficient stock" },
        },
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
        summary: "Cancel one of my orders (not delivered or already cancelled)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Order cancelled and stock restored" },
          "404": { description: "Not found" },
          "409": { description: "Order is already cancelled, delivered, or status just changed" },
        },
      },
    },
    "/orders/admin/all": {
      get: {
        tags: ["Orders (admin)"],
        summary: "List all orders with search, status filter and pagination (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            },
          },
          {
            name: "q",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Search by customer name, email or order ID",
          },
          { name: "page", in: "query", required: false, schema: { type: "number", minimum: 1, default: 1 } },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "number", minimum: 1, maximum: 100, default: 20 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated orders with status counts and revenue",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdminOrderList" },
              },
            },
          },
          "400": { description: "Invalid status filter" },
          "401": { description: "No token provided" },
          "403": { description: "Admin access required" },
        },
      },
    },
    "/orders/admin/{id}": {
      get: {
        tags: ["Orders (admin)"],
        summary: "Get any order by ID (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Order found" },
          "401": { description: "No token provided" },
          "403": { description: "Admin access required" },
          "404": { description: "Not found" },
        },
      },
    },
    "/orders/admin/{id}/status": {
      patch: {
        tags: ["Orders (admin)"],
        summary: "Change an order status (admin only)",
        description:
          "Allowed transitions: pending → paid or cancelled, paid → shipped, shipped → delivered. delivered and cancelled are final.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrderStatusInput" },
            },
          },
        },
        responses: {
          "200": { description: "Order status updated" },
          "400": { description: "Invalid status or transition not allowed" },
          "401": { description: "No token provided" },
          "403": { description: "Admin access required" },
          "404": { description: "Not found" },
        },
      },
    },
  },
};