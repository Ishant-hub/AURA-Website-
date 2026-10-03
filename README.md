# 🎧 AURA – Luxury Audio E-Commerce Platform

AURA is a modern full-stack e-commerce platform built for premium audio enthusiasts. The website offers a luxury shopping experience for high-end speakers, headphones, amplifiers, turntables, and professional audio equipment with a clean, responsive, and immersive user interface.

Designed using Next.js and Prisma, the platform combines elegant design with powerful backend functionality, making it a complete showcase of modern web development.

---

## ✨ Features

- 🛍️ Premium product catalog with detailed specifications
- 🔍 Category-based product browsing
- 📱 Fully responsive design for desktop, tablet, and mobile
- 🛒 Shopping cart with dynamic state management
- 🔐 Secure user authentication with JWT
- 👤 User account management
- ⭐ Product reviews and ratings
- 📩 Product inquiry and contact system
- 🛠️ Admin dashboard for managing products, orders, and website settings
- ⚡ Fast performance with Next.js App Router
- 🎨 Modern luxury UI built with Tailwind CSS

---
Live Link : https://aura-luxe-audio.vercel.app/

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- bcryptjs

---

## 📦 Database

Prisma ORM with PostgreSQL (Neon) powers the application's database, managing:

- Products
- Categories
- Users
- Orders
- Reviews
- Product Inquiries
- Website Settings

---

## 🚀 Key Functionalities

- Browse premium audio products
- View detailed product specifications
- Add products to cart
- Submit product inquiries
- Leave ratings and reviews
- User authentication and authorization
- Admin product management
- Order management
- Responsive shopping experience

---

## 📸 Screenshots

> Add screenshots of the Home Page, Product Details, Shopping Cart, and Admin Dashboard here.

---

## 📂 Project Structure

```
Electronics web/
├── frontend/             # Next.js Frontend (UI pages, components, context, styling)
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   └── lib/
│   └── package.json
├── backend/              # Backend Database & API services (Prisma ORM, schemas, seeders)
│   ├── prisma/
│   ├── src/
│   │   ├── api/
│   │   └── lib/
│   └── package.json
└── package.json          # Root workspace manifest
```

---

## ⚙️ Installation & Running

```bash
# 1. Clone repository
git clone https://github.com/your-username/aura-luxury-audio.git
cd aura-luxury-audio

# 2. Install workspace dependencies
npm install

# 3. Setup Database (Backend)
npm run db:push
npm run db:seed

# 4. Start Development Server (Frontend)
npm run dev:frontend
```

---

## 📌 Future Improvements

- Payment Gateway Integration
- Wishlist Functionality
- Product Search & Filters
- Order Tracking
- Email Notifications
- Inventory Management
- Analytics Dashboard

---

## 📄 License

This project was developed for educational and portfolio purposes.
