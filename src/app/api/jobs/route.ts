import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// Helper to serialize BigInt fields to strings before JSON output
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === "object" && obj[key].constructor && obj[key].constructor.name === "Decimal") {
        newObj[key] = parseFloat(obj[key].toString());
      } else {
        newObj[key] = serializeBigInt(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

import { getSession } from "../../../lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    const isVa = session?.user?.roles?.includes("va") || session?.user?.roles?.includes("VA");
    
    let hiredJobIds: bigint[] = [];

    if (isVa && session && session.user) {
      const vaProfile = await db.va_profiles.findUnique({
        where: { user_id: BigInt(session.user.id) }
      });
      if (vaProfile) {
        const hiredApps = await db.job_applications.findMany({
          where: { va_profile_id: vaProfile.id, status: "hired" },
          select: { job_post_id: true }
        });
        hiredJobIds = hiredApps.map(app => app.job_post_id);
      }
    }

    const dbJobs = await db.job_posts.findMany({
      where: {
        status: "active",
        ...(hiredJobIds.length > 0 ? { id: { notIn: hiredJobIds } } : {})
      },
      include: {
        client_profiles: true,
        job_post_skills: { include: { skills: true } },
        job_post_tools: { include: { tools: true } }
      }
    });

    // Map database structures to frontend JSON format
    const jobsList = dbJobs.map((job: any) => ({
      id: job.id.toString(),
      title: job.job_title,
      company: job.client_profiles.company_name,
      rate: parseFloat(job.va_hourly_rate.toString()),
      type: job.work_schedule || "Contract",
      location: job.timezone || "Remote",
      skills: job.job_post_skills.map((s: any) => s.skills.name),
      tools: job.job_post_tools.map((t: any) => t.tools.name),
      description: job.job_description,
      postedDate: "Today"
    }));

    return NextResponse.json(serializeBigInt(jobsList));
  } catch (error: any) {
    console.error("GET Jobs Error:", error);
    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
  }
}
