import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { requireRole } from "../../../../lib/auth";

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
    const currentUser = await requireRole("va");
    
    const profile = await db.va_profiles.findUnique({
      where: { user_id: BigInt(currentUser.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "VA Profile not found" }, { status: 404 });
    }

    const applications = await db.job_applications.findMany({
      where: { va_profile_id: profile.id },
      include: {
        job_posts: {
          include: { client_profiles: true }
        }
      },
      orderBy: { applied_at: "desc" }
    });

    const payload = applications.map((app: any) => ({
      id: app.id.toString(),
      jobId: app.job_post_id.toString(),
      jobTitle: app.job_posts.job_title,
      company: app.job_posts.client_profiles?.company_name || "Enterprise Client",
      status: app.status || "applied",
      appliedDate: app.applied_at ? app.applied_at.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A",
      coverMessage: app.cover_message || ""
    }));

    return NextResponse.json(serializeBigInt(payload));
  } catch (error: any) {
    console.error("GET Applications Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("va");
    
    const profile = await db.va_profiles.findUnique({
      where: { user_id: BigInt(currentUser.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "VA Profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { jobPostId, coverNote } = body;

    if (!jobPostId) {
      return NextResponse.json({ error: "Job Post ID is required" }, { status: 400 });
    }

    // Check duplicate
    const existing = await db.job_applications.findFirst({
      where: {
        job_post_id: BigInt(jobPostId),
        va_profile_id: profile.id
      }
    });

    if (existing) {
      return NextResponse.json({ error: "You have already applied to this job." }, { status: 400 });
    }

    const newApp = await db.job_applications.create({
      data: {
        job_post_id: BigInt(jobPostId),
        va_profile_id: profile.id,
        status: "applied",
        cover_message: coverNote || ""
      }
    });

    return NextResponse.json({ success: true, id: newApp.id.toString() });
  } catch (error: any) {
    console.error("POST Application Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
