# Aura Luxe Audio Deployment Guide

This guide explains how to migrate the database from SQLite to a production-ready PostgreSQL database on Neon, configure environment variables, run migrations, and deploy the application to Vercel.

---

## 1. Setting Up Neon PostgreSQL

### Step 1.1: Create a Neon Account & Project
1. Go to [Neon.tech](https://neon.tech/) and sign up or log in.
2. Click **Create Project**.
3. Name your project (e.g., `aura-luxe-audio`).
4. Select the PostgreSQL version (v16 recommended) and a region closest to your Vercel deployment region.
5. Click **Create Project**.

### Step 1.2: Retrieve Connection String
1. In the Neon Console Dashboard, navigate to the **Connection Details** section.
2. Ensure the dropdown selector has **Prisma** or **PostgreSQL** selected.
3. Copy the database connection string. It will look like this:
   ```text
   postgresql://[user]:[password]@[neon-hostname]/neondb?sslmode=require
   ```

---

## 2. Environment Variables Configuration

### Local Development (`.env`)
To run queries or seed the database locally, paste the connection string into your local `.env` file:
```env
DATABASE_URL="postgresql://user:password@ep-something.us-east-2.aws.neon.tech/neondb?sslmode=require"
```
> [!NOTE]
> Make sure to replace `user`, `password`, and `ep-something.us-east-2.aws.neon.tech` with your actual Neon database credentials.

### Production (Vercel Dashboard)
When deploying to Vercel, you must add the following environment variables in your Vercel Project Settings under **Environment Variables**:

| Variable Name | Description | Example / Note |
| :--- | :--- | :--- |
| `DATABASE_URL` | The Neon connection string | `postgresql://user:password@host/neondb?sslmode=require` |
| `JWT_SECRET` | Secret key used for signing JWT auth tokens | Choose a secure random string |

---

## 3. Database Migration and Seeding

Once the `DATABASE_URL` environment variable is configured (locally or via CLI), execute the following commands to initialize the schema and populate the database:

### Step 3.1: Push Schema to the Database
Since the schema is already updated to PostgreSQL, push it directly to Neon:
```bash
npx prisma db push
```
*(This creates the tables, relationships, and indexes directly in Neon according to `schema.prisma`)*

### Step 3.2: Seed the Database
Populate your Neon database with default categories, featured products, admin users, and initial settings:
```bash
node prisma/seed.js
```
*Note: The admin account created will have the email `admin@aurashowroom.com` with the password `admin123`.*

---

## 4. Deploying to Vercel

### Step 4.1: Install Vercel CLI (Optional)
If deploying via command line:
```bash
npm i -g vercel
vercel login
vercel
```

### Step 4.2: Deploy via Vercel Dashboard (Recommended)
1. Push your project code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New** > **Project**.
3. Import your repository.
4. Expand **Environment Variables** and add `DATABASE_URL` and `JWT_SECRET` (as configured in Section 2).
5. In **Build & Development Settings**, keep defaults. (Vercel automatically runs `next build`).
6. To automate database generation on every build, verify that your project's `package.json` contains Prisma client hooks. Vercel automatically runs `prisma generate` if it detects Prisma in dependencies. Alternatively, you can customize the Build Command to:
   ```bash
   npx prisma generate && next build
   ```
7. Click **Deploy**.

---

## 5. Verification Checklist

After deployment, verify the following screens and functionalities:
- [ ] **Homepage**: Loads products dynamically from the Neon database.
- [ ] **Login & Signup**: Creates new customer users and issues valid JWT cookies.
- [ ] **Product details**: Renders product images, metadata, and handles JSON parsing of technical `specs` field correctly.
- [ ] **Cart & Checkout**: Adding to cart and submitting orders writes order data (and order items) successfully to Postgres.
- [ ] **Reviews**: Posting product reviews writes to the `Review` table.
- [ ] **Book Demo / Inquiry**: Submitting contact/inquiry forms adds records to the `Inquiry` table.
- [ ] **Admin Dashboard**: Accessible by logging in with `admin@aurashowroom.com` (password `admin123`) to view and manage products/orders.
