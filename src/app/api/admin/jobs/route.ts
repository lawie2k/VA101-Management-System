import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole("admin");

    const jobsRaw = await prisma.job_posts.findMany({
      where: {
        status: {
          in: ["pending_review", "revision_requested", "rejected"]
        }
      },
      include: {
        client_profiles: {
          include: { users: true }
        },
        niches: true
      },
      orderBy: { created_at: 'desc' }
    });

    const formattedJobs = jobsRaw.map(job => {
      // Create a nice meta string: Industry • Schedule • Hourly Rate
      const metaParts = [];
      if (job.niches?.name) metaParts.push(job.niches.name);
      if (job.work_schedule || job.work_shift) {
        metaParts.push([job.work_schedule, job.work_shift].filter(Boolean).join(", "));
      }
      metaParts.push(`$${job.client_hourly_rate}/hr`);

      return {
        id: `JOB-${job.id.toString()}`,
        company: job.client_profiles?.company_name || "Unknown Company",
        title: job.job_title,
        meta: metaParts.join(" • "),
        description: job.job_description,
        status: job.status === "pending_review" ? "Pending Review" : 
                job.status === "approved" ? "Approved" : 
                job.status === "rejected" ? "Rejected" : 
                job.status === "revision_requested" ? "Revision Requested" : 
                (job.status || "Pending Review")
      };
    });

    return NextResponse.json({ jobs: formattedJobs });

  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole("admin");
    const { jobId, status } = await req.json();

    if (!jobId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // jobId comes in as "JOB-1042", so we parse it
    const id = parseInt(jobId.toString().replace("JOB-", ""), 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid Job ID" }, { status: 400 });
    }

    await prisma.job_posts.update({
      where: { id: BigInt(id) },
      data: { status }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Failed to update job status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
