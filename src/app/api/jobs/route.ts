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

export async function GET() {
  try {
    let dbJobs = await db.job_posts.findMany({
      include: {
        client_profiles: true,
        job_post_skills: { include: { skills: true } },
        job_post_tools: { include: { tools: true } }
      }
    });

    // Auto-seed initial jobs if database has no postings
    if (dbJobs.length === 0) {
      let clientProfile = await db.client_profiles.findFirst();
      if (!clientProfile) {
        let clientUser = await db.users.findFirst({ where: { email: "client@example.com" } });
        if (!clientUser) {
          clientUser = await db.users.create({
            data: {
              full_name: "John Client",
              email: "client@example.com",
              password_hash: "$2a$12$mockhashval1234567890abcde"
            }
          });
        }
        clientProfile = await db.client_profiles.create({
          data: {
            user_id: clientUser.id,
            company_name: "VA101 Global Ltd"
          }
        });
      }

      const seedJobs = [
        {
          client_profile_id: clientProfile.id,
          job_title: "Social Media Manager",
          job_description: "Help curate outbound Instagram & LinkedIn content updates, handle scheduling, and design layouts.",
          va_hourly_rate: 10.00,
          client_hourly_rate: 13.00,
          platform_hourly_commission: 3.00,
          work_schedule: "Part-time",
          timezone: "Remote (US Eastern Time)",
          status: "active"
        },
        {
          client_profile_id: clientProfile.id,
          job_title: "Executive Assistant",
          job_description: "Manage CEO schedules, coordinate flight reservations, email monitoring, and client communication.",
          va_hourly_rate: 15.00,
          client_hourly_rate: 19.50,
          platform_hourly_commission: 4.55,
          work_schedule: "Full-time",
          timezone: "Remote (US Pacific Time)",
          status: "active"
        },
        {
          client_profile_id: clientProfile.id,
          job_title: "Shopify Store Operations Specialist",
          job_description: "Track inventory, upload product descriptions, sync inventory coordinates, and process refunds.",
          va_hourly_rate: 12.50,
          client_hourly_rate: 16.25,
          platform_hourly_commission: 3.75,
          work_schedule: "Contract",
          timezone: "Remote (APAC / Europe)",
          status: "active"
        }
      ];

      for (const item of seedJobs) {
        await db.job_posts.create({ data: item });
      }

      // Re-fetch seed data
      dbJobs = await db.job_posts.findMany({
        include: {
          client_profiles: true,
          job_post_skills: { include: { skills: true } },
          job_post_tools: { include: { tools: true } }
        }
      });
    }

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
