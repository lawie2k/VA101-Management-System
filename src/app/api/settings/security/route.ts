import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/auth";
import bcrypt from "bcrypt";

export async function PUT(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the user from the database to get the hashed password
    const dbUser = await prisma.users.findUnique({
      where: { id: BigInt(user.id) }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, dbUser.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    // Hash and update the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    await prisma.users.update({
      where: { id: BigInt(user.id) },
      data: {
        password_hash: newPasswordHash,
        updated_at: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating security settings:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.status || 500 }
    );
  }
}
