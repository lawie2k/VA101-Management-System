import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { sendEmail } from "@/src/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ success: true, message: "If an account exists, a recovery code has been sent." });
    }

    // Generate a secure 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save to DB
    await prisma.users.update({
      where: { id: user.id },
      data: {
        reset_code: resetCode,
        reset_code_expires: expiresAt,
      },
    });

    // Send the email
    const name = user.full_name || "User";
    await sendEmail({
      toAddress: email,
      subject: "Your VA101 Password Recovery Code",
      htmlBody: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #E84E29;">Password Recovery</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset the password for your VA101 account. Enter the code below to proceed:</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0; text-align: center;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0ea5e9;">${resetCode}</span>
          </div>
          <p>This code is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,<br/>The VA101 Team</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: "If an account exists, a recovery code has been sent." });

  } catch (error) {
    console.error("Error sending recovery code:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
