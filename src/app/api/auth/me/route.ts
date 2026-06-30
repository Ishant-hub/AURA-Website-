import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("aura_session");

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json(
        { user: null, message: "No active session found." },
        { status: 401 }
      );
    }

    const decoded = verifyToken(tokenCookie.value);
    if (!decoded) {
      return NextResponse.json(
        { user: null, message: "Session expired or invalid." },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { user: null, message: "User not found." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Session error:", error);
    return NextResponse.json(
      { user: null, message: "Internal server error." },
      { status: 500 }
    );
  }
}
