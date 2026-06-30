import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";

// ============================================================
// Constants
// ============================================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "va101-fallback-secret-change-me"
);
const COOKIE_NAME = "va101_session";
const TOKEN_EXPIRY = "7d"; // 7 days

// ============================================================
// Types
// ============================================================

export interface SessionUser {
  id: string; // BigInt serialized as string
  email: string;
  fullName: string | null;
  profilePhotoUrl: string | null;
  roles: string[];
}

export interface Session {
  user: SessionUser;
  expires: Date;
}

// ============================================================
// Password Utilities
// ============================================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================================
// JWT Token Management
// ============================================================

export async function createToken(user: SessionUser): Promise<string> {
  // Avoid encoding large base64 profile pictures in the cookie payload to prevent header overflow crashes
  const sanitizedUser = {
    ...user,
    profilePhotoUrl: null,
  };
  const token = await new SignJWT({ user: sanitizedUser })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
  return token;
}

export async function verifyToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return (payload as unknown as { user: SessionUser }).user;
  } catch {
    return null;
  }
}

// ============================================================
// Cookie / Session Management
// ============================================================

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await createToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Get the current session from cookies. Use in Server Components and Route Handlers.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const user = await verifyToken(token);
  if (!user) return null;

  return {
    user,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
}

// ============================================================
// Auth Middleware Helpers (for API Route Handlers)
// ============================================================

/**
 * Require authentication. Returns the session user or throws.
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new AuthError("Not authenticated", 401);
  }
  return session.user;
}

/**
 * Require specific role(s). Returns the session user or throws.
 */
export async function requireRole(
  ...allowedRoles: string[]
): Promise<SessionUser> {
  const user = await requireAuth();
  const hasRole = user.roles.some((role) => allowedRoles.includes(role));
  if (!hasRole) {
    throw new AuthError("Insufficient permissions", 403);
  }
  return user;
}

// ============================================================
// Custom Error Class
// ============================================================

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}

// ============================================================
// User Lookup with Roles
// ============================================================

/**
 * Fetch a user by email, including their roles.
 */
export async function getUserWithRoles(email: string) {
  const user = await db.users.findUnique({
    where: { email },
    include: {
      user_roles: {
        include: {
          roles: true,
        },
      },
    },
  });
  return user;
}

/**
 * Build a SessionUser from a database user record.
 */
export function buildSessionUser(
  user: Awaited<ReturnType<typeof getUserWithRoles>>
): SessionUser | null {
  if (!user) return null;
  return {
    id: user.id.toString(),
    email: user.email,
    fullName: user.full_name,
    profilePhotoUrl: user.profile_photo_url,
    roles: user.user_roles.map((ur) => ur.roles.name),
  };
}
