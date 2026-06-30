import React from "react";
import db from "@/lib/db";
import HomePageClient from "@/components/HomePageClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch featured products dynamically from the database
  const featuredProducts = await db.product.findMany({
    where: { isFeatured: true },
    include: { images: true },
    take: 3,
  });

  // Convert schema relation structure to plain objects for safe propagation to Client Component
  const serializedProducts = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    price: Number(p.price),
    description: p.description,
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
    })),
  }));

  return (
    <main className="w-full flex-1">
      <HomePageClient featuredProducts={serializedProducts} />
    </main>
  );
}

