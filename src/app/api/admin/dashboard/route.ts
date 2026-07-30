import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole("admin", "employee");

    // --- METRICS (COUNTS) ---
    
    // 1. Pending Job Posts
    const pendingJobPostsCount = await prisma.job_posts.count({
      where: { status: "pending_review" }
    });

    // 2. VA Applications to screen
    const pendingApplicationsCount = await prisma.job_applications.count({
      where: { status: { in: ["applied", "under_review"] } }
    });

    // 3. Pending training materials
    const pendingTrainingMaterialsCount = await prisma.training_materials.count({
      where: { status: "pending_review" }
    });

    // 4. Discovery calls (requested, payment_pending, or confirmed)
    const discoveryCallsCount = await prisma.discovery_calls.count({
      where: { status: { in: ["requested", "payment_pending", "confirmed"] } }
    });

    // 5. Initial interviews (scheduled)
    const initialInterviewsCount = await prisma.interviews.count({
      where: { interview_type: "initial", status: "scheduled" }
    });

    // 6. Client interviews (scheduled)
    const clientInterviewsCount = await prisma.interviews.count({
      where: { interview_type: "client", status: "scheduled" }
    });

    // 7. Currently shortlisted
    const shortlistedCount = await prisma.shortlists.count({
      where: { status: "shortlisted" }
    });

    // --- QUEUES (LISTS) ---
    
    // 1. Recent Pending Job Posts
    const recentPendingJobsRaw = await prisma.job_posts.findMany({
      where: { status: "pending_review" },
      include: { client_profiles: true },
      orderBy: { created_at: 'desc' },
      take: 5
    });
    const recentPendingJobs = recentPendingJobsRaw.map(j => ({
      id: j.id.toString(),
      title: j.job_title,
      company: j.client_profiles?.company_name || "Unknown Company",
      status: j.status
    }));

    // 2. Recent VA Applications
    const recentApplicationsRaw = await prisma.job_applications.findMany({
      where: { status: { in: ["applied", "under_review"] } },
      include: {
        job_posts: true,
        va_profiles: { include: { users: { select: { full_name: true } } } }
      },
      orderBy: { applied_at: 'desc' },
      take: 5
    });
    const recentApplications = recentApplicationsRaw.map(a => ({
      id: a.id.toString(),
      name: a.va_profiles?.users?.full_name || "Unknown VA",
      jobTitle: a.job_posts?.job_title || "Unknown Role",
      status: a.status
    }));

    // 3. Recent Training Materials
    const recentTrainingMaterialsRaw = await prisma.training_materials.findMany({
      where: { status: "pending_review" },
      include: { trainer_profiles: { include: { users: { select: { full_name: true } } } } },
      orderBy: { created_at: 'desc' },
      take: 5
    });
    const recentTrainingMaterials = recentTrainingMaterialsRaw.map(t => ({
      id: t.id.toString(),
      title: t.title,
      trainer: t.trainer_profiles?.users?.full_name || "Unknown Trainer",
      price: t.price ? Number(t.price) : 0,
      status: t.status
    }));

    // 4. Recent Discovery Calls
    const recentDiscoveryCallsRaw = await prisma.discovery_calls.findMany({
      where: { status: { in: ["requested", "payment_pending", "confirmed"] } },
      include: { client_profiles: true },
      orderBy: { created_at: 'desc' },
      take: 5
    });
    const recentDiscoveryCalls = recentDiscoveryCallsRaw.map(d => ({
      id: d.id.toString(),
      company: d.client_profiles?.company_name || "Unknown Company",
      date: d.scheduled_at 
        ? d.scheduled_at.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
        : (d.requested_date ? d.requested_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "TBD"),
      status: d.status
    }));

    return NextResponse.json({
      metrics: {
        pendingJobPosts: pendingJobPostsCount,
        pendingApplications: pendingApplicationsCount,
        pendingTrainingMaterials: pendingTrainingMaterialsCount,
        discoveryCalls: discoveryCallsCount,
        initialInterviews: initialInterviewsCount,
        clientInterviews: clientInterviewsCount,
        shortlisted: shortlistedCount
      },
      queues: {
        recentPendingJobs,
        recentApplications,
        recentTrainingMaterials,
        recentDiscoveryCalls
      }
    });

  } catch (error) {
    console.error("Failed to fetch admin dashboard stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
