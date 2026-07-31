import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";

import { requireRole } from "../../../../lib/auth";

export async function GET(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const clientProfile = await prisma.client_profiles.findUnique({
      where: { user_id: BigInt(userId) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    // Fetch interviews linked to job_applications -> job_posts belonging to this client
    const rawInterviews = await prisma.interviews.findMany({
      where: {
        interview_type: "client",
        status: { notIn: ["hired", "rejected"] },
        job_applications: {
          job_posts: {
            client_profile_id: clientProfile.id
          }
        }
      },
      include: {
        job_applications: {
          include: {
            job_posts: { select: { job_title: true, role_needed: true } },
            va_profiles: {
              include: {
                users: { select: { full_name: true } }
              }
            }
          }
        }
      },
      orderBy: { scheduled_at: 'asc' },
      take: 50
    });

    const formatted = rawInterviews.map(i => ({
      id: i.id.toString(),
      candidateName: i.job_applications?.va_profiles?.users?.full_name || "Unknown Candidate",
      role: i.job_applications?.job_posts?.role_needed || i.job_applications?.job_posts?.job_title || "Role",
      date: i.scheduled_at ? i.scheduled_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD",
      time: i.scheduled_at ? i.scheduled_at.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : "TBD",
      raw_scheduled_at: i.scheduled_at ? i.scheduled_at.toISOString() : null,
      status: i.status === "completed" ? "Completed" : "Upcoming",
      meetLink: i.meeting_link || "",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch interviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
