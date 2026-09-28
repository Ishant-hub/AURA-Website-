import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { verifyToken } from "@/lib/auth";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("aura_session")?.value;
  if (!token) return null;
  
  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") return null;
  return payload;
}

export async function POST(req) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { name, slug, brand, description, price, stock, categoryId, specs, imageUrl } = await req.json();

    if (!name || !slug || !brand || !description || !price || !categoryId) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await db.product.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json({ message: "Product slug already exists." }, { status: 400 });
    }

    // Create product
    const product = await db.product.create({
      data: {
        name,
        slug,
        brand,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        categoryId,
        specs: specs || "{}",
        isOutOfStock: (parseInt(stock) || 0) <= 0,
      },
    });

    // Create product image
    if (imageUrl) {
      await db.productImage.create({
        data: {
          url: imageUrl,
          productId: product.id,
        },
      });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ message: error.message || "Failed to create product." }, { status: 500 });
  }
}
