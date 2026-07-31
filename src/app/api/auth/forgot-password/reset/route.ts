import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Validate code one last time before changing password
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        reset_code: true,
        reset_code_expires: true,
      }
    });

    if (!user || user.reset_code !== code || !user.reset_code_expires || new Date() > user.reset_code_expires) {
      return NextResponse.json({ error: "Invalid or expired recovery code" }, { status: 400 });
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset code
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password_hash: passwordHash,
        reset_code: null,
        reset_code_expires: null,
      },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
