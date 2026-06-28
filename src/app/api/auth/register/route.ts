import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { hashPassword, setSessionCookie, buildSessionUser } from "../../../../lib/auth";
import { rateLimit, getClientIp } from "../../../../lib/rateLimit";

// Strict validation regex patterns (to prevent SQL injections, invalid emails, and HTML sanitization)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z0-9\s,.'-]{2,100}$/;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    
    // Rate limit: Max 5 registrations per minute per IP
    const limiter = rateLimit(ip, 5, 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { fullName, email, password, accountType } = body;

    // 1. Basic sanitization & validations
    if (!fullName || !email || !password || !accountType) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!NAME_REGEX.test(fullName)) {
      return NextResponse.json(
        { error: "Invalid name format (alphanumeric, spaces, and punctuation only, 2-100 characters)" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 2. Password Strength Check: Minimum 8 characters, at least 1 uppercase letter
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);

    if (!hasMinLength || !hasUppercase) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long and contain at least 1 uppercase letter." },
        { status: 400 }
      );
    }

    const validRoles = ["va", "client", "trainer", "student"];
    if (!validRoles.includes(accountType)) {
      return NextResponse.json(
        { error: "Invalid account type selected" },
        { status: 400 }
      );
    }

    // 3. Check for existing email (parameterized query automatically handled by Prisma)
    const existingUser = await db.users.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // 4. Hash Password
    const passwordHash = await hashPassword(password);

    // 5. Create user, assign roles, and map profiles using transactions to guarantee integrity
    const user = await db.$transaction(async (tx) => {
      // Create user
      const createdUser = await tx.users.create({
        data: {
          full_name: fullName.trim(),
          email: email.toLowerCase().trim(),
          password_hash: passwordHash,
          account_status: "active",
        },
      });

      // Find or create role record dynamically
      let roleRecord = await tx.roles.findUnique({
        where: { name: accountType },
      });
      if (!roleRecord) {
        roleRecord = await tx.roles.create({
          data: {
            name: accountType,
            description: `Role for platform ${accountType} users`,
          },
        });
      }

      // Map user role
      await tx.user_roles.create({
        data: {
          user_id: createdUser.id,
          role_id: roleRecord.id,
        },
      });

      // Create matching blank profile
      if (accountType === "va") {
        await tx.va_profiles.create({
          data: {
            user_id: createdUser.id,
            profile_status: "draft",
            profile_visibility: "private",
          },
        });
      } else if (accountType === "client") {
        await tx.client_profiles.create({
          data: {
            user_id: createdUser.id,
            company_name: fullName.trim(), // Defaults company_name to name inputted
            status: "active",
          },
        });
      } else if (accountType === "trainer") {
        await tx.trainer_profiles.create({
          data: {
            user_id: createdUser.id,
            status: "active",
          },
        });
      } else if (accountType === "student") {
        await tx.student_profiles.create({
          data: {
            user_id: createdUser.id,
            status: "active",
          },
        });
      }

      return createdUser;
    });

    // 6. Set active cookie session
    const sessionUser = {
      id: user.id.toString(),
      email: user.email,
      fullName: user.full_name,
      profilePhotoUrl: user.profile_photo_url,
      roles: [accountType],
    };

    await setSessionCookie(sessionUser);

    return NextResponse.json({
      success: true,
      user: {
        id: sessionUser.id,
        email: sessionUser.email,
        fullName: sessionUser.fullName,
        role: accountType,
      },
    });
  } catch (err: any) {
    console.error("Register Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
