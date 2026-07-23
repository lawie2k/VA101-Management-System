import { NextResponse } from "next/server";
import { db as prisma } from "../../../../../lib/db";
import { requireRole } from "../../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("client");
    
    const body = await req.json();
    const { vaProfileId, rating, comment } = body;

    if (!vaProfileId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify client has a profile
    const clientProfile = await prisma.client_profiles.findFirst({
      where: { user_id: BigInt(currentUser.id) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    // Verify there is an actual contract between this client and VA (optional, but good practice)
    const contract = await prisma.contracts.findFirst({
      where: {
        client_profile_id: clientProfile.id,
        va_profile_id: BigInt(vaProfileId)
      }
    });

    if (!contract) {
      return NextResponse.json({ error: "No contract found with this VA" }, { status: 403 });
    }

    // Insert feedback
    await prisma.va_feedback.create({
      data: {
        va_profile_id: BigInt(vaProfileId),
        reviewer_user_id: BigInt(currentUser.id),
        rating: Number(rating),
        comment: comment || null
      }
    });

    return NextResponse.json({ success: true, message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Failed to submit feedback:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
