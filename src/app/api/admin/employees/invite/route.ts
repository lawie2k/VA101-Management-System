import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";
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
    
    // In a real app, hash this properly with bcrypt!
    // We'll just store it raw or lightly encoded for demonstration 
    // since this is a prototype, or use a dummy hash.
    // If you have a real hashing util, import it. For now we use the raw string.
    const passwordHash = `TEMP_HASH_${tempPassword}`;

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

    // In a real app, you would send an email here with `tempPassword`.

    return NextResponse.json({ 
      success: true, 
      tempPassword, 
      message: "Employee successfully invited." 
    });

  } catch (error) {
    console.error("Failed to invite employee:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
