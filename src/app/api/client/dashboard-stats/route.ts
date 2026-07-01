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

    // Fetch up to 3 most recent active jobs
    const rawJobs = await prisma.job_posts.findMany({
      where: {
        client_profile_id: clientProfile.id,
        status: "active"
      },
      include: {
        _count: {
          select: { job_applications: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 3
    });

    const jobPosts = rawJobs.map(job => ({
      id: job.id.toString(),
      title: job.job_title,
      type: job.work_schedule || "Full-time",
      rate: job.client_hourly_rate ? Number(job.client_hourly_rate) : 0,
      status: job.status,
      applicants: job._count.job_applications,
      postedDate: job.created_at ? job.created_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently",
    }));

    // Fetch up to 3 most recent shortlists
    const rawShortlists = await prisma.shortlists.findMany({
      where: {
        client_profile_id: clientProfile.id
      },
      include: {
        job_applications: {
          include: {
            va_profiles: {
              include: {
                users: { select: { full_name: true, profile_photo_url: true } },
                va_skills: { include: { skills: true } }
              }
            },
            job_posts: { select: { role_needed: true, job_title: true, client_hourly_rate: true } }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 3
    });

    const shortlistedCandidates = rawShortlists.map(s => {
      const vaProfile = s.job_applications?.va_profiles;
      const jobPost = s.job_applications?.job_posts;
      return {
        id: s.id.toString(),
        name: vaProfile?.users?.full_name || "Unknown Candidate",
        title: jobPost?.role_needed || jobPost?.job_title,
        location: vaProfile?.location || "Global",
        skills: vaProfile?.va_skills.map(skillLink => skillLink.skills.name).slice(0, 3) || [],
        hourlyRate: jobPost?.client_hourly_rate ? Number(jobPost.client_hourly_rate) : 0,
        avatar: vaProfile?.users?.profile_photo_url || null,
      };
    });

    return NextResponse.json({ jobPosts, shortlistedCandidates });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
