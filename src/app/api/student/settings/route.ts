import { NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import { requireRole } from "../../../../lib/auth";

export async function PATCH(req: Request) {
  try {
    const currentUser = await requireRole("student");
    const userId = currentUser.id;

    const body = await req.json();
    const { action } = body;

    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "update_password") {
      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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

      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    if (action === "update_email") {
      const { newEmail, currentPassword } = body;
      if (!newEmail || !currentPassword) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
      }

      // Check if email is already taken
      const existingEmail = await prisma.users.findUnique({
        where: { email: newEmail }
      });

      if (existingEmail && existingEmail.id !== BigInt(userId)) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }

      await prisma.users.update({
        where: { id: BigInt(userId) },
        data: { email: newEmail }
      });

      return NextResponse.json({ success: true, message: "Email updated successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Failed to update student settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const currentUser = await requireRole("student");
    const userId = currentUser.id;

    // Delete user (cascade handles student_profiles)
    await prisma.users.delete({
      where: { id: BigInt(userId) }
    });

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
