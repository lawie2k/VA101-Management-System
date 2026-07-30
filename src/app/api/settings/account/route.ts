import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/auth";

export async function PUT(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    
    const {
      fullName,
      email,
      phone,
      country,
      language,
      timezone
    } = body;

    // Check if email is already taken by another user if it changed
    if (email && email !== user.email) {
      const existing = await prisma.users.findUnique({
        where: { email }
      });
      if (existing) {
        return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id: BigInt(user.id) },
      data: {
        ...(fullName && { full_name: fullName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(country && { country }),
        ...(language && { language }),
        ...(timezone && { timezone }),
        updated_at: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        fullName: updatedUser.full_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        country: updatedUser.country,
        language: updatedUser.language,
        timezone: updatedUser.timezone
      }
    });
  } catch (error: any) {
    console.error("Error updating account settings:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.status || 500 }
    );
  }
}
