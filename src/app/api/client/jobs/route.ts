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

    const rawJobs = await prisma.job_posts.findMany({
      where: {
        client_profile_id: clientProfile.id
      },
      include: {
        _count: {
          select: { job_applications: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 50
    });

    const formatted = rawJobs.map(job => ({
      id: job.id.toString(),
      title: job.job_title,
      type: job.work_schedule || "Full-time",
      rate: job.client_hourly_rate ? parseFloat(job.client_hourly_rate.toString()) : 0,
      status: job.status === "active" ? "Active" : 
              (job.status === "pending_review" ? "Pending" : 
              (job.status === "needs_revision" ? "Needs Revision" : 
              (job.status === "archived" ? "Archived" : "Declined"))),
      applicants: job._count.job_applications,
      postedDate: job.created_at ? job.created_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const clientProfile = await prisma.client_profiles.findUnique({
      where: { user_id: BigInt(userId) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { 
      jobTitle, roleNeeded, workSchedule, workShift, timezone, 
      clientHourlyRate, vaHourlyRate, niche, skills, tools, jobDescription 
    } = body;

    const newJob = await prisma.$transaction(async (tx) => {
      let nicheId = null;
      if (niche) {
        let n = await tx.niches.findFirst({ where: { name: niche } });
        if (!n) n = await tx.niches.create({ data: { name: niche, description: "" } });
        nicheId = n.id;
      }

      const commissionRate = 30.00;
      const parsedClientRate = parseFloat(clientHourlyRate) || 0;
      const parsedVaRate = parseFloat(vaHourlyRate) || (parsedClientRate * 0.7);
      const commission = parsedClientRate - parsedVaRate;

      const job = await tx.job_posts.create({
        data: {
          client_profile_id: clientProfile.id,
          niche_id: nicheId,
          job_title: jobTitle,
          job_description: jobDescription || "",
          role_needed: roleNeeded,
          work_schedule: workSchedule,
          work_shift: workShift,
          timezone: timezone,
          client_hourly_rate: parsedClientRate,
          va_hourly_rate: parsedVaRate,
          platform_commission_rate: commissionRate,
          platform_hourly_commission: commission,
          currency: "USD",
          status: "pending_review"
        }
      });

      if (skills && Array.isArray(skills)) {
        for (const skillName of skills) {
          let skill = await tx.skills.findFirst({ where: { name: skillName } });
          if (!skill) skill = await tx.skills.create({ data: { name: skillName } });
          await tx.job_post_skills.create({ data: { job_post_id: job.id, skill_id: skill.id } });
        }
      }

      if (tools && Array.isArray(tools)) {
        for (const toolName of tools) {
          let tool = await tx.tools.findFirst({ where: { name: toolName } });
          if (!tool) tool = await tx.tools.create({ data: { name: toolName } });
          await tx.job_post_tools.create({ data: { job_post_id: job.id, tool_id: tool.id } });
        }
      }

      return job;
    });

    return NextResponse.json({ success: true, jobId: newJob.id.toString() }, { status: 201 });
  } catch (error) {
    console.error("Failed to post job:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
