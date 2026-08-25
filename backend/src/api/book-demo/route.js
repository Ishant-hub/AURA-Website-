import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const { name, email, phone, message, showroom } = await req.json();

    if (!name || !phone || !message) {
      return NextResponse.json(
        { message: "Invalid payload. Name, phone number, and requests are required." },
        { status: 400 }
      );
    }

    // Save inquiry to the database
    const inquiry = await db.inquiry.create({
      data: {
        name,
        email,
        phone,
        message: `[SHOWROOM: ${showroom.toUpperCase()}] ${message}`,
      },
    });

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
    });
  } catch (error) {
    console.error("Book Demo API error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while transmitting your request." },
      { status: 500 }
    );
  }
}
