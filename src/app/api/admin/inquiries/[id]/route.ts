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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const { isResolved } = await req.json();

    const updatedInquiry = await db.inquiry.update({
      where: { id },
      data: {
        isResolved,
      },
    });

    return NextResponse.json({ success: true, inquiry: updatedInquiry });
  } catch (error: any) {
    console.error("PATCH Inquiry Error:", error);
    return NextResponse.json({ message: "Failed to update inquiry." }, { status: 500 });
  }
}
