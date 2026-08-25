# PROJECT_KNOWLEDGE.md — Single Source of Truth for AURA Luxe Audio

---

## 1. Project Overview

### Project Name
**AURA | Luxe Audio (Showroom & E-Commerce Network)**

### Purpose
AURA Luxe Audio is a premium, full-stack web application designed for high-end acoustic equipment, flagship loudspeakers, vacuum tube amplifiers, reference turntables, and precision audio accessories. The platform bridges the gap between digital e-commerce and exclusive luxury showroom concierges, enabling users to explore high-fidelity hardware, book private acoustics listener sessions, configure custom orders, and monitor white-glove delivery in real time.

### Problem It Solves
High-end audiophile equipment and bespoke acoustic hardware (ranging from $4,000 to $45,000+) require more than a standard retail store interface. Traditional e-commerce platforms lack the refined design aesthetic, white-glove concierge booking workflows, custom room calibration tracking, and transactional stock protection necessary for high-value inventory. AURA solves this by providing:
1. An immersive, dark-mode luxury visual experience with glassmorphism and acoustic micro-interactions.
2. Direct integration between online catalog browsing and physical showroom reservation requests.
3. Transaction-safe purchasing with strict stock lockouts to prevent overselling limited-edition production runs.
4. An integrated administrative dashboard to manage products, categories, white-glove order lifecycles, and client inquiries.

### Target Users
* **Audiophiles & Music Enthusiasts:** High-net-worth individual customers seeking reference-grade home audio equipment, acoustic tuning devices, and personalized showroom consultations.
* **Luxury Interior & Acoustic Designers:** Clients requesting bespoke installation demos at luxury showrooms in Milan, Munich, New York, or London.
* **Showroom Administrators & Inventory Managers:** Internal staff responsible for catalog management, stock updates, inquiry triage, and order status transitions (Placed $\rightarrow$ Shipped $\rightarrow$ Delivered / Cancelled).

### Main Features
* **Dynamic Product Catalog & Filtering:** Dynamic category routing (`/speakers`, `/amplifiers`, `/turntables`, `/accessories`) backed by PostgreSQL query filtering.
* **Interactive Product Detail Canvas:** Multi-angle 4K high-resolution gallery switcher, detailed technical specification breakdown, stock status indicator, and dynamic quantity selector.
* **Persistent Cart & Checkout System:** Client-side cart state saved in `localStorage`, automatic 8% tax calculation, complimentary White-Glove delivery tiering, credit card & Apple Pay UI options, and immediate transaction completion.
* **Transactional Checkout & Stock Management:** Server-side atomic database transaction using Prisma `$transaction` that validates inventory, decrements product stock, marks items as out-of-stock when depleted, and assigns a unique `AURA-XXXXXX` order tracking code.
* **Bespoke Showroom Demo Booking:** Private concierge reservation form capturing client contact details, preferred international location, and specific equipment interest.
* **Real-Time Order & Logistics Tracking:** Concierge tracking page (`/track-order?orderNumber=AURA-XXXXXX`) featuring a visual stepper tracking order state (Placed $\rightarrow$ Transit $\rightarrow$ Installed/Calibrated) and recipient details.
* **Role-Based Authentication & Route Protection:** Custom JWT implementation stored in `httpOnly` cookies with Next.js edge middleware restricting `/admin`, `/checkout`, and administrative API endpoints.
* **Administrative Showroom Registry Dashboard:** Unified admin panel for real-time sales overview analytics, product creation/editing, inventory adjustment, order status updates, and inquiry management.

### Tech Stack

| Layer | Technology | Version | Purpose / Notes |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 15.2.1 | Server Components, Client Components, Dynamic API Routes, Edge Middleware |
| **Language** | TypeScript | ^5 | End-to-end static typing for models, API contracts, and React props |
| **Styling** | Tailwind CSS v4 | ^4.0.0 | Custom design system using `@theme` css variables, glassmorphism, and responsive utilities |
| **Database ORM** | Prisma | ^6.4.1 | Schema modeling, migration management, and type-safe database queries |
| **Database** | PostgreSQL | Local/Cloud | Relational storage for users, products, categories, orders, inquiries, and settings |
| **Authentication** | `jsonwebtoken` & `bcryptjs` | ^9.0.2 / ^3.0.2 | JWT signing/verification and salted password hashing (10 salt rounds) |
| **Icons** | Lucide React | ^0.475.0 | Modern vector icons for luxury UI elements |
| **Typography** | Google Fonts (Manrope / Hanken) | Web API | Modern sans-serif typography for body, headline, and uppercase label tracking |

### Folder Structure

```
Electronics web/
├── frontend/                      # Frontend Next.js Application & Client Components
│   ├── public/                    # Static public assets (images, icons, svgs)
│   ├── src/
│   │   ├── app/                   # Next.js UI Pages (layout, pages, dynamic routes, globals.css)
│   │   ├── components/            # React UI components (Header, Footer, CategoryPage, AdminDashboardClient, etc.)
│   │   ├── context/               # React context providers (AuthContext, CartContext)
│   │   ├── lib/                   # Frontend helpers & utilities
│   │   └── middleware.ts          # Edge middleware protecting admin/checkout routes
│   ├── package.json               # Frontend dependencies & Next.js scripts
│   ├── tsconfig.json              # Frontend TypeScript configuration
│   ├── next.config.ts             # Next.js configuration
│   └── postcss.config.mjs         # Tailwind PostCSS styling configuration
├── backend/                       # Backend Database Layer & Server API Services
│   ├── prisma/                    # Database ORM, schema.prisma, seed.js, dev.db
│   │   ├── schema.prisma          # Database schema definitions
│   │   ├── seed.js                # Database seed script for initial categories, products, & admin user
│   │   └── dev.db                 # SQLite development database
│   ├── src/
│   │   ├── api/                   # Server-side API route handlers (admin, auth, checkout, book-demo)
│   │   └── lib/                   # Database ORM singleton (db.ts), JWT auth helpers (auth.ts)
│   ├── package.json               # Backend dependencies & Prisma scripts
│   └── tsconfig.json              # Backend TypeScript configuration
├── package.json                   # Root workspace manifest & convenient dev/build scripts
├── README.md                      # Setup and execution guide for frontend & backend
└── PROJECT_KNOWLEDGE.md           # Single Source of Truth Documentation
```

### High-Level Architecture

```mermaid
graph TD
    Client[Browser / Client Component] <--> Middleware[Next.js Edge Middleware]
    Middleware <--> AuthContext[AuthContext / JWT Cookie check]
    Client <--> AppRouter[Next.js App Router - Server Pages & API Routes]
    AppRouter <--> PrismaORM[Prisma ORM Client Singleton lib/db.ts]
    PrismaORM <--> PostgreSQL[(PostgreSQL Database)]
    Client <--> LocalStorage[(Browser LocalStorage - Cart State)]
```

---

## 2. Complete Workflow

### 1. Catalog Browsing & Category Filtering Workflow
* **User Action:** The user navigates to `/speakers`, `/amplifiers`, `/turntables`, or `/accessories`.
* **Frontend Processing:** Next.js renders `CategoryPage.tsx` with the appropriate `categorySlug`. Client-side state manages `selectedBrand` and `sortBy` ("featured", "price-low", "price-high").
* **Backend Processing:** `CategoryPage` renders `HomePageClient` or fetches products matching the category slug via Prisma.
* **Database Operations:** `db.category.findUnique({ where: { slug }, include: { products: { include: { images: true } } } })`.
* **Response Returned:** Serialized list of products with associated images, category name, and initial stock.
* **UI Updates:** Category page renders product cards displaying brand, title, converted price, thumbnail image, stock badge ("IN STOCK" or "OUT OF STOCK"), and a link to `/product/[slug]`.

### 2. Product Detail & Specification Inspection Workflow
* **User Action:** User clicks on a product card or directly navigates to `/product/eclipse-x1`.
* **Frontend Processing:** Next.js invokes `generateMetadata` for dynamic SEO, then renders `ProductPage` (`src/app/product/[slug]/page.tsx`).
* **Backend Processing:** `db.product.findUnique({ where: { slug }, include: { images: true } })` runs on the server.
* **Database Operations:** SQL `SELECT` query joining `Product` and `ProductImage` tables by `slug`.
* **Response Returned:** Product object containing images, description, price, stock, and JSON-parsed technical specifications (`specs`).
* **UI Updates:** `ProductDetailClient.tsx` displays the active image, image thumbnails selector, dynamic quantity stepper, technical specs breakdown, and an "ADD TO CURATION" button.

### 3. Shopping Cart Addition & Persistence Workflow
* **User Action:** User selects a quantity and clicks "ADD TO CURATION".
* **Frontend Processing:** `addToCart(product, quantity)` is executed from `CartContext.tsx`.
* **Backend Processing:** None (Client-side state management).
* **Database Operations:** None.
* **Response Returned:** None.
* **UI Updates:** `CartContext` updates `cart` state array. A `useEffect` hook syncs the updated array to `localStorage.getItem("aura_cart")`. Header cart counter updates instantly with the total item count.

### 4. User Authentication (Login / Sign Up) Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Page as Login Page (Client)
    participant API as /api/auth/login
    participant DB as PostgreSQL (Prisma)
    participant Cookie as HttpOnly Cookie (aura_session)

    User->>Page: Enters email/password & submits form
    Page->>API: POST /api/auth/login { email, password }
    API->>DB: db.user.findFirst({ where: { email } })
    DB-->>API: User record (with hashedPassword)
    API->>API: bcrypt.compare(password, hashedPassword)
    alt Password Invalid
        API-->>Page: 401 Unauthorized { success: false, message: "Invalid email or password" }
        Page-->>User: Displays error notification banner
    else Password Valid
        API->>API: signToken({ id, email, role, name })
        API->>Cookie: Set cookie 'aura_session' (httpOnly, Secure, SameSite=Lax, Max-Age=7d)
        API-->>Page: 200 OK { success: true, user: { id, email, role, name } }
        Page->>User: AuthContext state updated, redirects to / or /admin
    end
```

### 5. Multi-Step Checkout & Transactional Order Workflow
* **User Action:** User opens `/checkout`, reviews cart items in Step 1, inputs shipping/payment details in Step 2, and clicks "COMPLETE PURCHASE".
* **Frontend Processing:** `handleCompletePurchase` constructs order payload containing `shippingInfo`, `paymentMethod`, `cartItems`, and `totalAmount`, then issues `POST /api/checkout`.
* **Backend Processing:** `/api/checkout/route.ts` parses the request. It initializes a Prisma `$transaction` block:
  1. Validates that every requested product exists and has sufficient `stock >= requestedQuantity`.
  2. Generates a unique tracking code: `AURA-${Math.floor(100000 + Math.random() * 900000)}`.
  3. Creates an `Order` record linked to `userId` (if logged in) along with nested `OrderItem` records.
  4. For each purchased product: decrements `stock` by `requestedQuantity`. If the new stock is 0, sets `isOutOfStock = true`.
* **Database Operations:** Atomic execution of SQL `INSERT INTO "Order"`, `INSERT INTO "OrderItem"`, and multiple `UPDATE "Product" SET stock = stock - X, isOutOfStock = ...`.
* **Response Returned:** `201 Created` with `{ success: true, orderNumber: "AURA-XXXXXX", orderId: "..." }`.
* **UI Updates:** Client calls `clearCart()`, clears `localStorage`, advances to Step 3 ("Curation Confirmed"), and displays the unique order number with delivery instructions.

### 6. Real-Time Order Tracking Workflow
* **User Action:** User navigates to `/track-order` and submits an order number (e.g. `AURA-801292`).
* **Frontend Processing:** Next.js processes query parameter `?orderNumber=AURA-801292` via Server Component `TrackOrder`.
* **Backend Processing:** Executes `db.order.findUnique({ where: { orderNumber }, include: { orderItems: { include: { product: true } } } })`.
* **Database Operations:** SQL lookup on `Order` table indexed by unique `orderNumber`.
* **Response Returned:** Order object with populated product details and current `status` (`PLACED`, `SHIPPED`, `DELIVERED`, or `CANCELLED`).
* **UI Updates:** Visual stepper highlights current status step (1: PLACED, 2: TRANSIT, 3: INSTALLED/CALIBRATED), renders list of ordered items, and displays recipient destination details.

### 7. Bespoke Showroom Demo Booking Workflow
* **User Action:** User fills out the booking form at `/book-demo` (Full Name, Email, Phone, Preferred Showroom, Requests) and submits.
* **Frontend Processing:** Client component fires `POST /api/book-demo`.
* **Backend Processing:** API route validates required fields, constructs message payload formatted with showroom location, and calls `db.inquiry.create`.
* **Database Operations:** `INSERT INTO "Inquiry" (id, name, email, phone, message, isResolved, createdAt)`.
* **Response Returned:** `201 Created` with `{ success: true, message: "Demo request recorded successfully" }`.
* **UI Updates:** Displays confirmation screen ("Reservation Requested") stating that a concierge from the selected showroom will call within 2 hours.

### 8. Administrative Inventory & Order Management Workflow
* **User Action:** Admin logs in and opens `/admin`.
* **Frontend Processing:** Server component verifies JWT via `cookies()`, confirms `payload.role === "ADMIN"`, fetches dashboard data, and hydrates `AdminDashboardClient.tsx`.
* **Backend Processing:** Server-side data fetching loads orders, products, categories, and inquiries in parallel via Prisma.
* **Database Operations:** Multiple `findMany` queries with ordering and relational joins.
* **Response Returned:** HTML response with serialized props for initial orders, products, categories, and inquiries.
* **UI Updates:** Render dashboard with 4 tabs: Overview (Revenue analytics, recent orders), Products (Add product modal, stock adjustment, soft delete), Orders (Status state machine dropdown: PLACED $\rightarrow$ SHIPPED $\rightarrow$ DELIVERED / CANCELLED), and Inquiries (Triage resolve toggle & deletion).

---

## 3. Frontend Documentation

### Directory Structure & File Catalog

#### `src/app/layout.tsx`
* **Why It Exists:** Root layout component for the entire Next.js App Router application.
* **What It Does:** Configures HTML metadata (Title: "AURA | Experience Sound Beyond Imagination"), loads external Google Fonts (Manrope, Hanken Grotesk, Material Symbols Outlined), applies root dark theme CSS classes, and wraps the application tree in global context providers (`AuthProvider` $\rightarrow$ `CartProvider` $\rightarrow$ `Header` $\rightarrow$ `children` $\rightarrow$ `Footer`).
* **Props:** `{ children: React.ReactNode }`.
* **State & Hooks:** None (Server Component).

#### `src/app/page.tsx`
* **Why It Exists:** Landing page of the website.
* **What It Does:** Enforces `dynamic = "force-dynamic"`. Fetches top 3 featured products from PostgreSQL database via Prisma Client (`db.product.findMany({ where: { isFeatured: true }, include: { images: true }, take: 3 })`), converts schema relations into plain JavaScript objects, and passes them to `HomePageClient`.
* **Props:** None.
* **State & Hooks:** None (Server Component).

#### `src/app/globals.css`
* **Why It Exists:** Global CSS stylesheet utilizing Tailwind CSS v4 styling rules and custom design variables.
* **What It Does:** Defines CSS theme variables (`--color-primary: #f2ca50`, `--color-background: #131313`, `--color-surface: #131313`, typography scales), sets up global body styles, glassmorphism utilities (`.glass-panel`, `.glass-card`), hover glow effects (`.gold-glow`, `.gold-glint`), infinite scrolling marquee animations (`@keyframes marquee`), and custom font-class assignments.

#### `src/app/access-denied/page.tsx`
* **Why It Exists:** Fallback page rendered when unauthorized users attempt to access `/admin`.
* **What It Does:** Displays a warning shield icon with an animated pulse effect, firewall header message, and quick navigation actions to return to the catalog or authenticate credentials.

#### `src/app/accessories/page.tsx`, `amplifiers/page.tsx`, `speakers/page.tsx`, `turntables/page.tsx`
* **Why They Exist:** Dedicated category routes for catalog navigation.
* **What They Do:** Server components that set page-specific metadata and render the `CategoryPage` client component with specific `categorySlug`, `title`, and `description`.

#### `src/app/admin/page.tsx`
* **Why It Exists:** Server-side route handler for the administrative dashboard.
* **What It Does:** Reads `aura_session` cookie from `next/headers`, verifies JWT token using `verifyToken`. If token is missing or `role !== "ADMIN"`, redirects immediately to `/login`. Fetches all orders (with order items and product relations), products (with categories and images), categories, and inquiries from PostgreSQL via Prisma, serializes dates to ISO strings, and passes initial data to `AdminDashboardClient`.

#### `src/app/book-demo/page.tsx`
* **Why It Exists:** Page for booking private showroom listening sessions.
* **What It Does:** Interactive client form capturing client details (name, email, phone, preferred showroom: Milan, Munich, New York, London, and custom requests). Sends `POST /api/book-demo` and toggles to a confirmation view upon success.

#### `src/app/checkout/page.tsx`
* **Why It Exists:** Unified shopping cart review and multi-step checkout workflow.
* **What It Does:** Client component powered by `useCart()` and `useAuth()`.
  * **Step 1:** Detailed cart item list, quantity modification buttons, remove item buttons, and summary calculations.
  * **Step 2:** Shipping destination form and payment method selection (Credit Card / Apple Pay). Submits request to `/api/checkout`.
  * **Step 3:** Order confirmation view displaying the generated `AURA-XXXXXX` order tracking number.

#### `src/app/login/page.tsx`
* **Why It Exists:** Unified page for User Authentication (Login & Registration).
* **What It Does:** Wrapped in Next.js `Suspense`. Features an interactive animated vinyl record turntable illustration on the left panel. Provides tabbed switching between Login and Sign Up forms. Interacts with `AuthContext` functions (`login` and `signup`). Supports a mock password recovery invitation trigger.

#### `src/app/product/[slug]/page.tsx`
* **Why It Exists:** Dynamic product detail page route.
* **What It Does:** Exports `generateMetadata` for dynamic page titles. Server component that fetches product by `slug` with attached `images`. Returns `notFound()` if product does not exist, otherwise passes serialized product object to `ProductDetailClient`.

#### `src/app/track-order/page.tsx`
* **Why It Exists:** Order status and delivery tracking page.
* **What It Does:** Reads `searchParams` for `orderNumber`. If present, fetches order from PostgreSQL database including nested order items and products. Renders a visual tracking stepper (Placed $\rightarrow$ Transit $\rightarrow$ Installed), payment status badge, delivery address details, and item breakdown.

#### `src/components/Header.tsx`
* **Why It Exists:** Main navigation header bar present on all pages.
* **What It Does:** Sticky header with backdrop-blur. Displays brand logo ("AURA"), main category links (`Loudspeakers`, `Amplifiers`, `Turntables`, `Accessories`), Concierge link (`Book Demo`), Order Tracking link (`Track Order`), Auth button (shows User name / "Registry Login" or Logout action), Admin badge (if user is ADMIN), and Cart button with dynamic item counter badge.

#### `src/components/Footer.tsx`
* **Why It Exists:** Global site footer.
* **What It Does:** Displays brand ethos, quick category links, international showroom physical address directory (Milan, Munich, New York, London), newsletter subscription form, copyright details, and system build status indicators.

#### `src/components/HomePageClient.tsx`
* **Why It Exists:** Client interactive component for the homepage.
* **What It Does:** Renders:
  1. Full-screen Hero section with background video/image overlays and call-to-action buttons.
  2. Infinite marquee banner scrolling luxury audio engineering terms.
  3. Featured Products Grid dynamically rendered from props with quick "ADD TO CURATION" buttons.
  4. Brand Philosophy & Acoustic Engineering feature spotlight section.
  5. Showroom Listening Experience banner promoting private bookings.

#### `src/components/CategoryPage.tsx`
* **Why It Exists:** Generic, reusable catalog component powering all category routes.
* **What It Does:** Fetches category products from `/api/admin/products` or client state filter, allows sorting by price (Low to High, High to Low) or feature status, filters by brand, and renders product grid with stock status tags.

#### `src/components/ProductDetailClient.tsx`
* **Why It Exists:** Client-side detail view for individual products.
* **What It Does:** Features image gallery preview with thumbnail switcher, quantity adjustment stepper, stock availability indicator, price formatting, JSON technical specification table parser (rendering key-value pairs cleanly), and direct integration with `CartContext`.

#### `src/components/AdminDashboardClient.tsx`
* **Why It Exists:** Comprehensive administrative dashboard client interface.
* **What It Does:** Manages 4 admin views:
  * **Overview:** Metric cards (Total Revenue, Orders Count, Product Inventory, Active Inquiries), recent order registry table.
  * **Products:** Catalog table displaying images, name, category, price, stock, out-of-stock state. Contains "Add Product" modal with auto-slug generation, JSON specs input, image URL input, edit product modal, and soft-delete handler.
  * **Orders:** Order management table with dropdown state machine (`PLACED`, `SHIPPED`, `DELIVERED`, `CANCELLED`) and payment status toggle (`PAID` / `UNPAID`).
  * **Inquiries:** Client message management table with resolve/unresolve toggle and deletion button.

---

## 4. Backend Documentation

### API Routes & Endpoint Specifications

#### 1. Authentication Endpoints (`/api/auth`)

##### `POST /api/auth/login`
* **Description:** Authenticates a user or admin using email/username and password.
* **Request Body:**
  ```json
  {
    "email": "admin@aura.com",
    "password": "adminpassword123"
  }
  ```
* **Processing:**
  1. Searches `db.user.findFirst` matching `email` OR `username`.
  2. Compares plain password with stored `password` hash using `bcrypt.compare`.
  3. If valid, signs JWT containing `{ id, email, role, name }` via `signToken`.
  4. Attaches `aura_session` cookie to HTTP response header (`HttpOnly`, `Path=/`, `Max-Age=604800` [7 days], `SameSite=Lax`).
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "user": {
      "id": "cm...1",
      "email": "admin@aura.com",
      "name": "Aura Administrator",
      "role": "ADMIN"
    }
  }
  ```
* **Error Scenarios:** `400 Bad Request` (Missing fields), `401 Unauthorized` (Invalid credentials).

##### `POST /api/auth/signup`
* **Description:** Registers a new customer account.
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
* **Processing:**
  1. Checks if `email` already exists in `User` table.
  2. Hashes password using `bcrypt.hash(password, 10)`.
  3. Generates username from name or email prefix.
  4. Creates new user with default role `"USER"`.
  5. Signs JWT token and sets `aura_session` cookie.
* **Response `201 Created`:** `{ "success": true, "user": { ... } }`.
* **Error Scenarios:** `400 Bad Request` (User already exists / validation failure).

##### `POST /api/auth/logout`
* **Description:** Ends user session by clearing JWT session cookie.
* **Request Body:** Empty.
* **Processing:** Sets `aura_session` cookie with `Max-Age=0` and expired date (`Expires=Thu, 01 Jan 1970 00:00:00 GMT`).
* **Response `200 OK`:** `{ "success": true, "message": "Logged out successfully" }`.

##### `GET /api/auth/me`
* **Description:** Fetches profile details of currently authenticated user.
* **Processing:** Reads `aura_session` cookie, verifies JWT with `verifyToken`, fetches user from DB excluding `password`.
* **Response `200 OK`:** `{ "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }`.
* **Error Scenarios:** `401 Unauthorized` (No cookie or invalid token).

---

#### 2. E-Commerce & Customer Actions (`/api/checkout`, `/api/book-demo`)

##### `POST /api/checkout`
* **Description:** Processes order transaction, validates inventory, creates Order and OrderItems, and decrements stock atomically.
* **Request Body:**
  ```json
  {
    "shippingInfo": {
      "name": "Jane Doe",
      "address": "123 Luxury Way",
      "city": "Milan",
      "pincode": "20121",
      "phone": "+39 02 5551234",
      "email": "jane@example.com"
    },
    "paymentMethod": "credit-card",
    "cartItems": [
      { "id": "prod_1", "quantity": 1, "price": 12500 }
    ],
    "totalAmount": 13500
  }
  ```
* **Processing (Prisma `$transaction`):**
  1. Validates each cart item against database stock.
  2. If stock is insufficient, throws error: `"Insufficient stock for product: [Product Name]"`.
  3. Generates `orderNumber`: `AURA-${Math.floor(100000 + Math.random() * 900000)}`.
  4. Inserts `Order` record with status `"PLACED"` and paymentStatus `"PAID"`.
  5. Inserts `OrderItem` records linking `orderId` and `productId`.
  6. Updates each `Product`: `stock = stock - item.quantity`. If updated stock is 0, sets `isOutOfStock = true`.
* **Response `201 Created`:**
  ```json
  {
    "success": true,
    "orderNumber": "AURA-801292",
    "orderId": "cl..."
  }
  ```
* **Error Scenarios:** `400 Bad Request` (Missing fields / Out of stock), `500 Internal Server Error`.

##### `POST /api/book-demo`
* **Description:** Records a showroom concierge booking request.
* **Request Body:** `{ "name": "...", "email": "...", "phone": "...", "showroom": "milan", "message": "..." }`.
* **Processing:** Creates a new `Inquiry` record with formatted message string `"SHOWROOM DEMO [MILAN]: ..."` and `isResolved = false`.
* **Response `201 Created`:** `{ "success": true, "message": "Demo request recorded successfully" }`.

---

#### 3. Administrative Endpoints (`/api/admin/*`)

##### `GET /api/admin/products` | `POST /api/admin/products`
* **Authentication Required:** Admin Role (`aura_session` JWT check).
* **GET:** Returns list of all products with associated `category` and `images`.
* **POST Request Body:**
  ```json
  {
    "name": "Bespoke Acoustic Tower",
    "description": "Reference tower speaker",
    "price": 18500,
    "stock": 5,
    "brand": "AURA",
    "categoryId": "cat_1",
    "imageUrl": "https://...",
    "specs": "{\"Driver\": \"10-inch Beryllium\"}"
  }
  ```
* **POST Processing:** Automatically generates `slug` from `name` (`bespoke-acoustic-tower`), creates `Product` record, and creates linked `ProductImage` record.

##### `PUT /api/admin/products/[id]` | `DELETE /api/admin/products/[id]`
* **PUT:** Updates existing product fields, stock count, price, and image URLs.
* **DELETE:** Checks if product has existing `OrderItem` references.
  * If order history exists: performs **Soft Delete / Archival** by updating `stock = 0` and `isOutOfStock = true` to preserve database integrity.
  * If no order history exists: performs physical deletion of `ProductImage` records and `Product` record.

##### `PATCH /api/admin/orders/[id]`
* **Authentication Required:** Admin Role.
* **Request Body:** `{ "status": "SHIPPED", "paymentStatus": "PAID" }`.
* **Processing:** Updates order status in PostgreSQL database (`PLACED` $\rightarrow$ `SHIPPED` $\rightarrow$ `DELIVERED` / `CANCELLED`).

##### `GET /api/admin/inquiries` | `PATCH /api/admin/inquiries/[id]` | `DELETE /api/admin/inquiries/[id]`
* **GET:** Lists all customer inquiries sorted by `createdAt desc`.
* **PATCH:** Toggles `isResolved` boolean state (`true`/`false`).
* **DELETE:** Deletes inquiry record from database.

---

## 5. Database & Schema Documentation

### Prisma Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PLACED
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String?  @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id           String         @id @default(cuid())
  name         String
  slug         String         @unique
  description  String
  price        Float
  stock        Int            @default(0)
  isOutOfStock Boolean        @default(false)
  isFeatured   Boolean        @default(false)
  specs        String?        // Stored as stringified JSON
  brand        String         @default("AURA")
  categoryId   String?
  category     Category?      @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  images       ProductImage[]
  orderItems   OrderItem[]
  reviews      Review[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model ProductImage {
  id        String   @id @default(cuid())
  url       String
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model Order {
  id            String        @id @default(cuid())
  orderNumber   String        @unique
  userId        String?
  user          User?         @relation(fields: [userId], references: [id], onDelete: SetNull)
  name          String
  email         String
  phone         String
  address       String
  city          String
  pincode       String
  totalAmount   Float
  status        OrderStatus   @default(PLACED)
  paymentStatus PaymentStatus @default(PENDING)
  orderItems    OrderItem[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  quantity  Int
  price     Float
  createdAt DateTime @default(now())
}

model Inquiry {
  id         String   @id @default(cuid())
  name       String
  email      String
  phone      String
  message    String
  isResolved Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Review {
  id        String   @id @default(cuid())
  rating    Int
  comment   String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}
```

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ Order : "places"
    User ||--o{ Review : "writes"
    Category ||--o{ Product : "contains"
    Product ||--o{ ProductImage : "has"
    Product ||--o{ OrderItem : "included_in"
    Product ||--o{ Review : "receives"
    Order ||--|{ OrderItem : "contains"
    Inquiry {
        string id PK
        string name
        string email
        string message
        boolean isResolved
    }
```

### Seed Data Script Summary (`prisma/seed.js`)
* **Admin User Creation:** Seeds default super-administrator account (`email: admin@aura.com`, `password: admin123`, `role: ADMIN`) with bcrypt hashed password.
* **Category Seeding:** Creates four core categories: `Loudspeakers` (`speakers`), `Amplifiers` (`amplifiers`), `Turntables` (`turntables`), and `Accessories` (`accessories`).
* **Product Seeding:** Populates 8 flagship products with high-resolution Google 4K imagery, custom pricing ($4,200 to $32,000), stock counts, and stringified JSON specs:
  1. **Eclipse X1** (Flagship Floorstanding Loudspeaker - $24,500)
  2. **Monolith Reference** (Active Subwoofer - $8,900)
  3. **Vacuum Master Amp** (Pure Class-A Tube Amp - $14,200)
  4. **Starlight Turntable** (Magnetic Levitation Vinyl Deck - $12,800)
  5. **Silencer Acoustic Panel** (Precision Tuning Baffle - $4,200)
  6. **Aura Cable Core** (Silver Core Interconnects - $2,800)
  7. **Hyperion Tower** (Ultra Loudspeaker System - $32,000)
  8. **Zero-Loss DAC** (D/A Converter - $9,500)

---

## 6. Authentication & Authorization

### JWT Session Architecture
Authentication is implemented via JSON Web Tokens (JWT) signed using `jsonwebtoken` and stored in a secure `HttpOnly` browser cookie (`aura_session`).

```mermaid
graph LR
    UserLogin[User / Admin Login] -->|Validate Password| SignJWT[Sign JWT with JWT_SECRET]
    SignJWT -->|Set Cookie| HttpCookie[httpOnly Cookie: aura_session]
    HttpCookie -->|Subsequent Requests| Middleware[Edge Middleware src/middleware.ts]
    Middleware -->|Verify Role| AdminArea[Access Granted: /admin]
    Middleware -->|No Token / Invalid| AccessDenied[Redirect: /login or /access-denied]
```

### Key Helpers (`src/lib/auth.ts`)
* `signToken(payload)`: Signs token containing `{ id, email, role, name }` with a 7-day expiration (`7d`).
* `verifyToken(token)`: Verifies signature against `process.env.JWT_SECRET || "default_secret_key"`.

### Route Protection Middleware (`src/middleware.ts`)
* **Protected Pages:** `/admin` (Requires `role === "ADMIN"`), `/checkout`, `/track-order`.
* **Protected APIs:** `/api/admin/*` (Requires `ADMIN` role).
* **Redirection Rules:**
  * If unauthenticated user attempts to access `/admin`: redirected to `/login?callbackUrl=/admin`.
  * If logged-in non-admin user attempts to access `/admin`: redirected to `/access-denied`.
  * If authenticated user visits `/login`: redirected back to `/`.

---

## 7. State Management

### 1. `AuthContext` (`src/context/AuthContext.tsx`)
* **Provides:** Global `user` state, `isLoading`, `login(email, password)`, `signup(name, email, password)`, `logout()`, and `requireAuth()`.
* **Session Restoration:** Executes `fetch("/api/auth/me")` inside `useEffect` on application mount to revalidate active cookie session seamlessly.

### 2. `CartContext` (`src/context/CartContext.tsx`)
* **Provides:** `cart` array, `addToCart(product, qty)`, `removeFromCart(id)`, `updateQuantity(id, delta)`, `clearCart()`, `subtotal`, `tax` (8%), and `total`.
* **Persistence Mechanism:** Reads initial cart state from `localStorage.getItem("aura_cart")`. Syncs changes automatically on state modification.

---

## 8. E-Commerce Logic & Business Rules

1. **Cart Subtotal & Tax Calculation:**
   $$\text{Subtotal} = \sum (\text{item.price} \times \text{item.quantity})$$
   $$\text{Tax (8\%)} = \text{Subtotal} \times 0.08$$
   $$\text{Total} = \text{Subtotal} + \text{Tax}$$
2. **White Glove Shipping Tier:** Complimentary shipping ($0.00) applied across all orders, guaranteeing personalized technician delivery and acoustic tuning.
3. **Atomic Stock Decrement:** Handled via Prisma `$transaction` during checkout to guarantee that two concurrent buyers cannot purchase depleted inventory.
4. **Out-of-Stock Lockout:** Products with `stock == 0` display a disabled "OUT OF STOCK" badge on product detail pages and catalog grids, blocking cart additions.
5. **Database Archival Strategy:** Admin product deletion preserves order history integrity by converting physical delete calls into a soft archival update (`stock = 0`, `isOutOfStock = true`) if the item has past `OrderItem` relations.

---

## 9. Admin Dashboard Capabilities

* **Sales Overview Analytics:** Displays Total Revenue (sum of all `PAID` orders), Total Orders count, Catalog Inventory count, and Pending Client Inquiries count.
* **Product CRUD Panel:** Form modal to create products, auto-format slugs, parse stringified JSON specs, adjust stock numbers, edit pricing, and soft-delete items.
* **Order Lifecycle Management:** Real-time state machine dropdown to transition orders (`PLACED` $\rightarrow$ `SHIPPED` $\rightarrow$ `DELIVERED` / `CANCELLED`) and toggle payment status (`PAID` / `PENDING`).
* **Concierge Inquiry Triage:** Displays incoming booking requests and contact inquiries, enabling administrators to toggle resolution status or delete completed items.

---

## 10. Form Validations & Error Handling

* **Client Validations:** Real-time email pattern checking, minimum password length enforcement (>= 6 chars), password matching validation, and empty field prevention.
* **Server Validations:** Duplicate email detection on signup, stock sufficiency validation on checkout, JSON spec syntax validation, and HTTP status code mappings (`400`, `401`, `403`, `404`, `500`).

---

## 11. Security Features & Best Practices

1. **Password Hashing:** Passwords hashed with `bcryptjs` using 10 salt rounds prior to storage. Plain text passwords are never stored or logged.
2. **HttpOnly Cookie Protection:** JWT session tokens stored in `httpOnly` cookies, preventing client-side JavaScript execution access (protecting against XSS token theft).
3. **SQL Injection Prevention:** All database access flows through Prisma ORM parameterized queries.
4. **Cross-Site Scripting (XSS) Mitigation:** React automatically escapes rendered strings in JSX.
5. **Role-Based Edge Authorization:** Route access rules enforced at the Edge Middleware layer prior to server component rendering.

---

## 12. Styling & UI Systems

* **Color Palette:** Curated dark mode aesthetic (`#0A0A0A` background, `#131313` surface, `#f2ca50` gold accent, `#e5e2e1` text).
* **Glassmorphism:** Custom `.glass-panel` and `.glass-card` classes using `backdrop-filter: blur(30px)` and subtle gold hover borders (`border-color: #f2ca50`).
* **Typography:** `Manrope` for display and body text; `Hanken Grotesk` for uppercase label caps tracking (`letter-spacing: 0.15em`).

---

## 13. Data Flow & Serialization

* **Server-to-Client Serialization:** Server components transform Prisma Decimal values to JavaScript numbers (`Number(p.price)`) and convert `Date` instances to ISO strings (`createdAt.toISOString()`) to avoid React SSR hydration mismatches.
* **JSON Specs Serialization:** Technical specs stored as stringified JSON objects (`JSON.stringify(specs)`) in PostgreSQL and parsed safely using `JSON.parse()` on client components.

---

## 14. Performance Optimizations

1. **Next.js App Router Server Components:** Database queries run directly on the server, sending pre-rendered HTML to the client and reducing JavaScript bundle size.
2. **Google 4K Image Helper (`get4KImageUrl`):** Appends `=w3840-h2160` parameters to Google user content URLs, serving ultra-high-resolution assets dynamically.
3. **Lazy Hydration:** Client components (`"use client"`) isolated to interactive sub-trees (forms, cart buttons, tabs).

---

## 15. Third-Party Integrations & Libraries

* `prisma` & `@prisma/client`: Database mapping and client generation.
* `bcryptjs`: Password salt hashing.
* `jsonwebtoken`: Token signing and verification.
* `lucide-react`: Modern SVG vector icons.
* `Google Fonts`: External typography stylesheet loading.

---

## 16. Environment Variables & Configuration

Create a `.env` file in the root directory:

```env
# Database connection string for PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aura_db?schema=public"

# Secret key for signing session JWT tokens
JWT_SECRET="aura_luxe_audio_super_secret_jwt_key_2026"
```

---

## 17. Setup & Installation Guide

### Prerequisites
* Node.js (v18.x or higher)
* npm (v9.x or higher)
* PostgreSQL Database Server (Running locally or via cloud provider)

### Step-by-Step Installation

1. **Clone repository & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create `.env` and set valid `DATABASE_URL` and `JWT_SECRET`.

3. **Push Prisma Schema to Database:**
   ```bash
   npx prisma db push
   ```

4. **Seed Database with Initial Data & Admin User:**
   ```bash
   node prisma/seed.js
   ```

5. **Start Local Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

6. **Admin Login Credentials:**
   * **Email:** `admin@aura.com`
   * **Password:** `admin123`

---

## 18. Testing & Edge Cases

* **Zero Stock Purchase Attempt:** If a user attempts to checkout an item with `stock = 0`, the backend aborts transaction and returns error message.
* **Double Submission Prevention:** Buttons show `"TRANSMITTING..."` or `"PROCESSING..."` and set `disabled={true}` while awaiting API response.
* **Expired Token Handling:** Middleware detects expired/invalid JWT, clears cookie, and redirects user to `/login`.
* **Soft Delete Validation:** Deleting a product with existing customer orders archives the product instead of crashing database foreign key constraints.

---

## 19. Deployment & Production Readiness

* **Build Command:** `npm run build` generates production-optimized Next.js bundle.
* **Start Command:** `npm run start` launches production server.
* **Prisma Production Deployment:** Run `npx prisma migrate deploy` in production CI/CD pipelines.

---

## 20. Future Enhancements & Roadmap

1. **Stripe Payment Gateway Integration:** Replace mock card inputs with live Stripe Elements payment intent processing.
2. **Automated Order Confirmation Emailing:** Integrate Resend or SendGrid to send PDF invoices upon successful checkout.
3. **User Profile Order History Page:** Dedicated `/profile` route displaying past orders and white-glove delivery status updates.
4. **Product Review Submission API:** Enable verified buyers to submit ratings and comments displayed on product pages.

---

## 21. Troubleshooting Guide

### Common Issues & Solutions

* **Issue:** Database connection error (`PrismaClientInitializationError`).
  * **Solution:** Verify PostgreSQL service is running and `DATABASE_URL` in `.env` is correct.
* **Issue:** JWT verification fails or user randomly logged out.
  * **Solution:** Ensure `JWT_SECRET` is consistent across restarts. Clear browser `aura_session` cookie and log in again.
* **Issue:** Images fail to render.
  * **Solution:** Check internet connectivity for Google content CDN URLs or verify `get4KImageUrl` utility string formatting.

---

## 22. API Specification Summary Table

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Public | Authenticates user/admin & sets session cookie |
| `/api/auth/signup` | POST | Public | Registers new user account |
| `/api/auth/logout` | POST | Public | Clears session cookie |
| `/api/auth/me` | GET | Authenticated | Returns current user profile |
| `/api/checkout` | POST | Public/User | Transactionally processes order & decrements stock |
| `/api/book-demo` | POST | Public | Submits private showroom concierge booking |
| `/api/admin/products` | GET / POST | Admin | Lists products or creates a new product |
| `/api/admin/products/[id]`| PUT / DELETE| Admin | Updates product details or soft-deletes item |
| `/api/admin/orders/[id]` | PATCH | Admin | Updates order status and payment status |
| `/api/admin/inquiries` | GET | Admin | Retrieves all concierge inquiries |
| `/api/admin/inquiries/[id]`| PATCH/DELETE| Admin | Toggles inquiry resolution or deletes inquiry |

---

## 23. Key Data Types & Interfaces

```typescript
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  brand: string;
  stock: number;
  isOutOfStock: boolean;
  specs?: string | null;
  images: { id: string; url: string }[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  totalAmount: number;
  status: "PLACED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: { name: string; slug: string };
  }[];
}
```

---

## 24. Design System Tokens Reference

```css
/* Color Palette Tokens */
--color-primary: #f2ca50;           /* Luxury Gold Accent */
--color-background: #131313;        /* Dark Matte Background */
--color-surface: #131313;           /* Surface Container Base */
--color-on-background: #e5e2e1;     /* Platinum Text */

/* Typography Tokens */
--font-body-md: "Manrope", sans-serif;
--font-label-caps: "Hanken Grotesk", sans-serif;
```

---

## 25. Security Audit & Checklist

* [x] **Passwords Salted & Hashed:** Utilizes bcryptjs with 10 rounds.
* [x] **Session Storage:** `httpOnly`, `SameSite=Lax` cookies prevent script theft.
* [x] **Route Firewall:** Edge middleware intercepts unauthorized requests before page compilation.
* [x] **Database Safety:** Prisma ORM guards against SQL injection attacks.
* [x] **Stock Locking:** Atomic `$transaction` prevents race conditions during sales.

---

## 26. Developer FAQ

### Q1: How do I add a new product category?
A: Insert a new record into the `Category` table via Prisma Studio (`npx prisma studio`) or seed script, then add a route under `src/app/[categorySlug]/page.tsx` rendering `<CategoryPage categorySlug="..." />`.

### Q2: What happens if a customer buys the last item in stock?
A: The checkout transaction decrements `stock` to 0 and automatically updates `isOutOfStock` to `true`. Subsequent attempts to add the item to cart are disabled.

### Q3: How is user authorization checked on administrative API routes?
A: Administrative API handlers read the `aura_session` cookie, decode the JWT via `verifyToken`, and verify `payload.role === "ADMIN"`. If validation fails, a `403 Forbidden` response is returned.

---

## 27. Viva & Technical Interview Guide

### Q1: How does the application handle atomic database transactions during checkout?
**Answer:** The checkout endpoint uses Prisma's `$transaction` API. Inside the transaction block, product stock levels are verified, an `Order` record and associated `OrderItem` records are created, and inventory stock counts are decremented. If any step fails (e.g. stock becomes insufficient mid-transaction), the entire database operation rolls back, maintaining inventory integrity.

### Q2: Why did you use Next.js App Router for this full-stack project?
**Answer:** Next.js App Router provides Server Components that fetch data directly on the server close to the database, reducing client JavaScript bundle sizes. Combined with Edge Middleware, we can protect administrative routes before any page rendering occurs.

### Q3: How does JWT session handling work with `HttpOnly` cookies?
**Answer:** Upon successful authentication, the server signs a JWT containing user claims and sets it as an `HttpOnly` cookie. Because `HttpOnly` is enabled, client-side scripts cannot access the token via `document.cookie`, mitigating XSS risks. The browser automatically attaches the cookie to subsequent same-origin HTTP requests.

---

## 28. Resume Bullet Points & Project Highlights

* **Full-Stack Engineering:** Engineered a full-stack luxury audio web application using Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Prisma ORM, and PostgreSQL.
* **Transaction-Safe Commerce Engine:** Architected an atomic checkout engine with Prisma `$transaction` handling inventory verification, stock decrements, and unique order tracking generation (`AURA-XXXXXX`).
* **Role-Based Edge Security:** Implemented custom JWT authentication stored in `HttpOnly` cookies with Next.js Edge Middleware protecting administrative dashboards and API routes.
* **State Management & Persistence:** Built React Context providers (`AuthContext`, `CartContext`) with `localStorage` synchronization for cart state and mount-time session revalidation.
* **Administrative Registry Dashboard:** Developed an administrative management console featuring product CRUD operations with soft deletion, live order state machine updates, and client inquiry triage.
