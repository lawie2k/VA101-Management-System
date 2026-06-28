import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { verifyPassword, setSessionCookie } from "../../../../lib/auth";
import { rateLimit, getClientIp } from "../../../../lib/rateLimit";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Rate Limit: Max 5 login attempts per minute per IP to prevent brute-force attacks
    const limiter = rateLimit(ip, 5, 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    // 1. Sanitization & input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 2. Lookup user and retrieve roles (Prisma parameterizes inputs by default, blocking SQL injection)
    const user = await db.users.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    // Handle authentication failures with a generic error message (standard security practice)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.account_status !== "active") {
      return NextResponse.json(
        { error: "Your account is currently disabled. Please contact support." },
        { status: 403 }
      );
    }

    // 3. Verify Password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 4. Map active roles
    const userRoles = user.user_roles.map((ur) => ur.roles.name);

    // 5. Establish session cookie
    const sessionUser = {
      id: user.id.toString(),
      email: user.email,
      fullName: user.full_name,
      profilePhotoUrl: user.profile_photo_url,
      roles: userRoles,
    };

    await setSessionCookie(sessionUser);

    return NextResponse.json({
      success: true,
      user: {
        id: sessionUser.id,
        email: sessionUser.email,
        fullName: sessionUser.fullName,
        roles: sessionUser.roles,
      },
    });
  } catch (err: any) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
