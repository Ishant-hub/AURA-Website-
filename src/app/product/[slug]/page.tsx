import React from "react";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import ProductDetailClient from "@/components/ProductDetailClient";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "Product Not Found | AURA",
    };
  }

  return {
    title: `AURA | ${product.name}`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Fetch product from SQLite database
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Cast product model to plain JS object to pass safely to Client Component
  const serializedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    brand: product.brand,
    stock: product.stock,
    isOutOfStock: product.isOutOfStock,
    specs: product.specs,
    images: product.images.map((img) => ({ id: img.id, url: img.url })),
  };

  return <ProductDetailClient product={serializedProduct} />;
}
