import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { getSession } from "../../../lib/auth";
import bcrypt from "bcryptjs";
import { rateLimit, getClientIp } from "../../../lib/rateLimit";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z0-9\s,.'-]{2,100}$/;

// Helper to serialize BigInt fields to strings to prevent JSON serialization errors
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    const serialized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        serialized[key] = serializeBigInt(obj[key]);
      }
    }
    return serialized;
  }
  return obj;
}

// ==========================================
// GET: Fetch discovery calls for logged-in Client
// ==========================================
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Lookup client profile
    const clientProfile = await db.client_profiles.findUnique({
      where: { user_id: BigInt(session.user.id) },
    });

    if (!clientProfile) {
      return NextResponse.json([]);
    }

    const calls = await db.discovery_calls.findMany({
      where: { client_profile_id: clientProfile.id },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(serializeBigInt(calls));
  } catch (err: any) {
    console.error("GET Discovery Calls Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching calls." },
      { status: 500 }
    );
  }
}

// ==========================================
// POST: Book a discovery call (Guest or Client)
// ==========================================
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Rate Limit: Max 5 booking requests per 10 minutes per IP
    const limiter = rateLimit(ip, 5, 10 * 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many booking requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      email,
      fullName,
      companyName,
      industry,
      companySize,
      companyWebsite,
      phone,
      requestedDate,
      requestedTime,
      notes,
    } = body;

    // Validation
    if (!requestedDate || !requestedTime) {
      return NextResponse.json(
        { error: "Requested date and time are required." },
        { status: 400 }
      );
    }

    const session = await getSession();
    let clientProfileId: bigint | null = null;

    if (session) {
      // --------------------------------------------------------
      // CASE 1: Logged-in Client
      // --------------------------------------------------------
      let clientProfile = await db.client_profiles.findUnique({
        where: { user_id: BigInt(session.user.id) },
      });

      // If client profile is missing, create it on the fly
      if (!clientProfile) {
        clientProfile = await db.client_profiles.create({
          data: {
            user_id: BigInt(session.user.id),
            company_name: companyName || session.user.fullName,
            industry: industry || null,
            company_size: companySize || null,
            company_website: companyWebsite || null,
            status: "active",
          },
        });
      }

      clientProfileId = clientProfile.id;
    } else {
      // --------------------------------------------------------
      // CASE 2: Guest / Unauthenticated Client
      // --------------------------------------------------------
      if (!email || !fullName || !companyName) {
        return NextResponse.json(
          { error: "Email, Full Name, and Company Name are required for guest bookings." },
          { status: 400 }
        );
      }

      if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format." },
          { status: 400 }
        );
      }

      if (!NAME_REGEX.test(fullName)) {
        return NextResponse.json(
          { error: "Invalid name format (alphanumeric, spaces, and punctuation only, 2-100 characters)." },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await db.users.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: {
          client_profiles: true,
        },
      });

      if (existingUser && existingUser.client_profiles) {
        clientProfileId = existingUser.client_profiles.id;
      }
    }

    // Create the discovery call booking
    // requested_date is Date, requested_time is Time
    const parsedDate = new Date(requestedDate);
    const parsedTime = new Date(`1970-01-01T${requestedTime}:00`);

    const discoveryCall = await db.discovery_calls.create({
      data: {
        client_profile_id: clientProfileId || null,
        guest_name: clientProfileId ? null : fullName?.trim(),
        guest_email: clientProfileId ? null : email?.toLowerCase().trim(),
        guest_company: clientProfileId ? null : companyName?.trim(),
        requested_date: parsedDate,
        requested_time: parsedTime,
        status: "requested",
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Discovery call requested successfully!",
      callId: discoveryCall.id.toString(),
    });
  } catch (err: any) {
    console.error("POST Discovery Calls Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while booking the call." },
      { status: 500 }
    );
  }
}
