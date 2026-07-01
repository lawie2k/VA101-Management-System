import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import bcrypt from "bcryptjs";
import { requireRole } from "../../../../lib/auth";

export async function PUT(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const { currentPassword, newPassword } = await req.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: BigInt(userId) },
      data: { password_hash: newHash }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    // Since onDelete: Cascade is configured in the DB for most relations,
    // deleting the user should clean up their profile.
    await prisma.users.delete({
      where: { id: BigInt(userId) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
