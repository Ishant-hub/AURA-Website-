import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const { shippingInfo, paymentMethod, cartItems, totalAmount } = await req.json();

    if (!shippingInfo || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { message: "Invalid payload. Missing shipping information or cart items." },
        { status: 400 }
      );
    }

    // Retrieve active session token from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("aura_session");
    let userId = undefined;
    if (sessionCookie?.value) {
      const decoded = verifyToken(sessionCookie.value);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    // Generate unique order number
    const orderNumber = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create the order in a transaction to ensure database consistency
    const result = await db.$transaction(async (tx) => {
      // 1. Verify and update stock
      for (const item of cartItems) {
        const dbProduct = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!dbProduct) {
          throw new Error(`Product with ID ${item.id} not found.`);
        }

        if (dbProduct.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${dbProduct.name}. Only ${dbProduct.stock} left.`);
        }

        // Decrement stock
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: dbProduct.stock - item.quantity,
            isOutOfStock: dbProduct.stock - item.quantity <= 0,
          },
        });
      }

      // 2. Create the Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: "PLACED",
          totalAmount,
          paymentStatus: paymentMethod === "credit-card" ? "PAID" : "PENDING",
          name: shippingInfo.name,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          pincode: shippingInfo.pincode,
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderNumber: result.orderNumber,
      orderId: result.id,
    });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred during checkout processing." },
      { status: 500 }
    );
  }
}
