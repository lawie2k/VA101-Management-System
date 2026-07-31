import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        reset_code: true,
        reset_code_expires: true,
      }
    });

    if (!user || user.reset_code !== code) {
      return NextResponse.json({ error: "Invalid or expired recovery code" }, { status: 400 });
    }

    // Check if expired
    if (!user.reset_code_expires || new Date() > user.reset_code_expires) {
      return NextResponse.json({ error: "Recovery code has expired. Please request a new one." }, { status: 400 });
    }

    // Code is valid
    return NextResponse.json({ success: true, message: "Code verified successfully" });

  } catch (error) {
    console.error("Error verifying recovery code:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
