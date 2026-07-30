import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await context.params;
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const clientProfile = await prisma.client_profiles.findUnique({
      where: { user_id: BigInt(userId) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    const job = await prisma.job_posts.findFirst({
      where: {
        id: BigInt(rawId),
        client_profile_id: clientProfile.id
      }
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found or access denied" }, { status: 404 });
    }

    const { status } = await req.json();

    if (!["active", "pending_review", "closed"].includes(status)) {
       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await prisma.job_posts.update({
      where: { id: BigInt(rawId) },
      data: { status }
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Failed to update job status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
