import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole, hashPassword } from "@/src/lib/auth";
import { sendEmail } from "@/src/lib/email";
import crypto from "crypto";

// Basic email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    await requireRole("admin");
    const { name, email, roleName } = await req.json();

    if (!name || !email || !roleName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    // Find the requested role
    const role = await prisma.roles.findUnique({
      where: { name: roleName }
    });

    if (!role || !["admin", "finance", "employee"].includes(role.name)) {
      return NextResponse.json({ error: "Invalid internal role" }, { status: 400 });
    }

    // Generate a temporary random password (8 chars)
    const tempPassword = crypto.randomBytes(4).toString('hex');
    
    // Hash the password securely so the user can log in
    const passwordHash = await hashPassword(tempPassword);

    // Create the user
    const newUser = await prisma.users.create({
      data: {
        full_name: name,
        email: email,
        password_hash: passwordHash,
        account_status: "active"
      }
    });

    // Assign the role
    await prisma.user_roles.create({
      data: {
        user_id: newUser.id,
        role_id: role.id
      }
    });

    // Send an email to the invited employee
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #E84E29;">Welcome to VA101, ${name}!</h2>
        <p>You have been invited to join the VA101 Internal Dashboard as a <strong>${role.name}</strong>.</p>
        <p>Your temporary password to log in is:</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 20px; font-weight: bold; text-align: center; letter-spacing: 2px; margin: 20px 0;">
          ${tempPassword}
        </div>
        <p>Please log in and change your password immediately.</p>
        <p>Best regards,<br>The VA101 Team</p>
      </div>
    `;

    await sendEmail({
      toAddress: email,
      subject: "You're Invited to VA101 Internal Staff",
      htmlBody: htmlBody
    });

    return NextResponse.json({ 
      success: true, 
      tempPassword: process.env.NODE_ENV === "development" ? tempPassword : undefined,
      message: "Employee successfully invited and emailed." 
    });

  } catch (error) {
    console.error("Failed to invite employee:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
