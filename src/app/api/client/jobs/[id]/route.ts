import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
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
      },
      include: {
        niches: true,
        job_post_skills: {
          include: { skills: true }
        },
        job_post_tools: {
          include: { tools: true }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Format the job for the edit modal
    const formattedJob = {
      id: job.id.toString(),
      jobTitle: job.job_title,
      jobDescription: job.job_description,
      roleNeeded: job.role_needed,
      workSchedule: job.work_schedule,
      timezone: job.timezone,
      clientHourlyRate: job.client_hourly_rate ? parseFloat(job.client_hourly_rate.toString()) : 0,
      niche: job.niches?.name || "",
      skills: job.job_post_skills.map(s => s.skills.name),
      tools: job.job_post_tools.map(t => t.tools.name)
    };

    return NextResponse.json(formattedJob);
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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

    const body = await req.json();
    const { 
      jobTitle, roleNeeded, workSchedule, timezone, 
      clientHourlyRate, niche, skills, tools, jobDescription 
    } = body;

    const updatedJob = await prisma.$transaction(async (tx) => {
      let nicheId = null;
      if (niche) {
        let n = await tx.niches.findFirst({ where: { name: niche } });
        if (!n) n = await tx.niches.create({ data: { name: niche, description: "" } });
        nicheId = n.id;
      }

      const commissionRate = 30.00;
      const parsedClientRate = parseFloat(clientHourlyRate) || 0;
      const parsedVaRate = parsedClientRate * 0.7;
      const commission = parsedClientRate - parsedVaRate;

      // Update the main job post
      const j = await tx.job_posts.update({
        where: { id: BigInt(rawId) },
        data: {
          niche_id: nicheId,
          job_title: jobTitle,
          job_description: jobDescription || "",
          role_needed: roleNeeded,
          work_schedule: workSchedule,
          timezone: timezone,
          client_hourly_rate: parsedClientRate,
          va_hourly_rate: parsedVaRate,
          platform_hourly_commission: commission,
        }
      });

      // Simple implementation: delete old skills/tools and insert new ones
      await tx.job_post_skills.deleteMany({ where: { job_post_id: j.id } });
      if (skills && Array.isArray(skills)) {
        for (const skillName of skills) {
          let skill = await tx.skills.findFirst({ where: { name: skillName } });
          if (!skill) skill = await tx.skills.create({ data: { name: skillName } });
          await tx.job_post_skills.create({ data: { job_post_id: j.id, skill_id: skill.id } });
        }
      }

      await tx.job_post_tools.deleteMany({ where: { job_post_id: j.id } });
      if (tools && Array.isArray(tools)) {
        for (const toolName of tools) {
          let tool = await tx.tools.findFirst({ where: { name: toolName } });
          if (!tool) tool = await tx.tools.create({ data: { name: toolName } });
          await tx.job_post_tools.create({ data: { job_post_id: j.id, tool_id: tool.id } });
        }
      }

      return j;
    });

    return NextResponse.json({ success: true, jobId: updatedJob.id.toString() });
  } catch (error) {
    console.error("Failed to update job:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
