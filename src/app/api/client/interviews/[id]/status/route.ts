import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;
    const { id } = await params;

    const clientProfile = await prisma.client_profiles.findUnique({
      where: { user_id: BigInt(userId) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    // Verify this interview belongs to this client
    const interview = await prisma.interviews.findFirst({
      where: {
        id: BigInt(id),
        interview_type: "client",
        job_applications: {
          job_posts: {
            client_profile_id: clientProfile.id
          }
        }
      }
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Mark the interview as completed
    await prisma.interviews.update({
      where: { id: BigInt(id) },
      data: { status: "completed" }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update interview status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
