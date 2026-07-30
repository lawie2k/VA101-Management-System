import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole("admin", "employee");

    const appsRaw = await prisma.job_applications.findMany({
      include: {
        va_profiles: {
          include: { users: true }
        },
        job_posts: {
          include: { niches: true }
        }
      },
      orderBy: { applied_at: 'desc' }
    });

    const formattedApps = appsRaw.map(app => {
      // Map database statuses to human-readable labels
      let displayStatus = app.status || "Applied";
      const rawStatus = (app.status || "").toLowerCase();
      
      if (rawStatus === "applied") displayStatus = "Applied";
      else if (rawStatus === "shortlisted_to_client") displayStatus = "Shortlisted To Client";
      else if (rawStatus === "initial_interview_scheduled") displayStatus = "Initial Interview Scheduled";
      else if (rawStatus === "client_interview_scheduled") displayStatus = "Client Interview Scheduled";
      else if (rawStatus === "under_business_review") displayStatus = "Under Business Review";
      else if (rawStatus === "hired") displayStatus = "Hired";
      else if (rawStatus === "initial_interview_failed") displayStatus = "Initial Interview Failed";
      else if (rawStatus === "rejected") displayStatus = "Rejected";

      return {
        id: app.id.toString(),
        name: app.va_profiles?.users?.full_name || "Unknown VA",
        job: app.job_posts?.job_title || "Unknown Job",
        niche: app.job_posts?.niches?.name || "Uncategorized",
        match: app.match_score ? `${app.match_score}%` : "N/A",
        status: displayStatus,
        rawStatus: rawStatus // keep raw for internal logic if needed
      };
    });

    return NextResponse.json({ applications: formattedApps });

  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole("admin", "employee");
    const { applicationId, status, meetingLink } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.job_applications.update({
      where: { id: BigInt(applicationId) },
      data: { status }
    });

    if (status === "initial_interview_scheduled") {
      await prisma.interviews.create({
        data: {
          job_application_id: BigInt(applicationId),
          interview_type: "initial",
          scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to tomorrow
          status: "Scheduled",
          result: "Pending",
          meeting_link: meetingLink || null
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Failed to update application status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
