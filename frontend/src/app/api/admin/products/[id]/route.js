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

export async function DELETE(req, { params }) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    // Delete related items first or use cascading delete.
    // In schema.prisma: ProductImage has Cascade, but OrderItem has Restrict (we don't want to delete past orders).
    // Let's check if the product has order items. If so, we should prevent deleting to avoid DB key crash, OR mark it out of stock/hidden, OR handle it cleanly.
    const orderItemsCount = await db.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      // Product has been ordered, we cannot hard-delete. We should soft-delete / set out of stock.
      await db.product.update({
        where: { id },
        data: {
          stock: 0,
          isOutOfStock: true,
          // We can append something to slug to free it up or just toggle stock.
          // Let's set description to show it is archived or hide it.
        },
      });
      return NextResponse.json({
        success: true,
        message: "Product has past orders. Archived and set to Out of Stock instead of physical deletion.",
      });
    }

    // Otherwise, physically delete the product (Prisma cascade will delete images).
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ message: "Failed to delete product." }, { status: 500 });
  }
}
