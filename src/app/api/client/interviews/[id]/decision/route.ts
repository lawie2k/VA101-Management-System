import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;
    const { id } = await params;

    const body = await req.json();
    const { action } = body; // "hire" or "reject"

    if (!action || !["hire", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action. Must be 'hire' or 'reject'." }, { status: 400 });
    }

    const clientProfile = await prisma.client_profiles.findUnique({
      where: { user_id: BigInt(userId) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    // Verify this interview belongs to this client and get linked data
    const interview = await prisma.interviews.findFirst({
      where: {
        id: BigInt(id),
        interview_type: "client",
        job_applications: {
          job_posts: {
            client_profile_id: clientProfile.id
          }
        }
      },
      include: {
        job_applications: {
          include: {
            job_posts: true,
            va_profiles: true
          }
        }
      }
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    const application = interview.job_applications;
    if (!application) {
      return NextResponse.json({ error: "Linked application not found" }, { status: 404 });
    }

    if (action === "reject") {
      // Update application status to rejected
      await prisma.job_applications.update({
        where: { id: application.id },
        data: { status: "client_rejected" }
      });

      // Update interview status
      await prisma.interviews.update({
        where: { id: BigInt(id) },
        data: { status: "rejected" }
      });

      // Update shortlist status if exists
      await prisma.shortlists.updateMany({
        where: {
          job_application_id: application.id,
          client_profile_id: clientProfile.id
        },
        data: { status: "rejected" }
      });

      return NextResponse.json({ success: true, action: "rejected" });
    }

    if (action === "hire") {
      // Update application status to hired
      await prisma.job_applications.update({
        where: { id: application.id },
        data: { status: "hired" }
      });

      // Update interview status
      await prisma.interviews.update({
        where: { id: BigInt(id) },
        data: { status: "hired" }
      });

      // Update shortlist status
      await prisma.shortlists.updateMany({
        where: {
          job_application_id: application.id,
          client_profile_id: clientProfile.id
        },
        data: { status: "hired" }
      });

      // Create an assignment
      const assignment = await prisma.assignments.create({
        data: {
          job_post_id: application.job_post_id,
          job_application_id: application.id,
          client_profile_id: clientProfile.id,
          va_profile_id: application.va_profile_id,
          status: "active",
          start_date: new Date()
        }
      });

      // Create a draft contract for the admin to fill in
      await prisma.contracts.create({
        data: {
          assignment_id: assignment.id,
          client_profile_id: clientProfile.id,
          va_profile_id: application.va_profile_id,
          file_url: "pending_admin_upload",
          status: "draft"
        }
      });

      return NextResponse.json({ success: true, action: "hired" });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  } catch (error) {
    console.error("Failed to process hiring decision:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
