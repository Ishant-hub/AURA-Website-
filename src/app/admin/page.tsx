import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const metadata = {
  title: "AURA | Showroom Registry Dashboard",
  description: "Secure administrative console for the Aura Private Showroom network.",
};

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("aura_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch orders, products, categories, and inquiries from SQLite
  const orders = await db.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const products = await db.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await db.category.findMany();
  
  const inquiries = await db.inquiry.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize models cleanly
  const serializedOrders = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    name: order.name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    pincode: order.pincode,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt.toISOString(),
    orderItems: order.orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      product: {
        name: item.product.name,
        slug: item.product.slug,
      },
    })),
  }));

  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    isOutOfStock: product.isOutOfStock,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
        }
      : null,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
    })),
  }));

  const serializedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));

  const serializedInquiries = inquiries.map((inq) => ({
    id: inq.id,
    name: inq.name,
    phone: inq.phone,
    email: inq.email,
    message: inq.message,
    isResolved: inq.isResolved,
    createdAt: inq.createdAt.toISOString(),
  }));

  return (
    <AdminDashboardClient
      initialOrders={serializedOrders}
      initialProducts={serializedProducts}
      categories={serializedCategories}
      inquiries={serializedInquiries}
    />
  );
}
