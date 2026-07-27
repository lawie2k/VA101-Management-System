import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const body = await req.json();
    const { signature } = body;

    if (!signature || signature.trim() === "") {
      return NextResponse.json({ error: "Signature is required" }, { status: 400 });
    }

    // Update the client profile to mark contract as signed
    await prisma.client_profiles.update({
      where: { user_id: BigInt(userId) },
      data: {
        has_signed_contract: true
        // Optionally, we could store the signature or a timestamp in the future if added to schema
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to sign contract:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
