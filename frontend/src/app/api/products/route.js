import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        price: "desc",
      },
    });

    const serializedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      isOutOfStock: product.isOutOfStock || product.stock <= 0,
      isFeatured: product.isFeatured,
      specs: product.specs,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
      })),
    }));

    return NextResponse.json({
      success: true,
      products: serializedProducts,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
