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

    const interviewsList = await db.interviews.findMany({
      where: {
        job_applications: {
          va_profile_id: profile.id
        },
        status: { not: "completed" }
      },
      include: {
        job_applications: {
          include: {
            job_posts: true
          }
        }
      },
      orderBy: { scheduled_at: "asc" }
    });

    const payload = interviewsList.map((item: any) => ({
      id: item.id.toString(),
      jobTitle: item.job_applications.job_posts.title,
      company: item.job_applications.job_posts.company_name || "Enterprise Client",
      type: item.interview_type || "initial_interview",
      scheduledAt: item.scheduled_at.toISOString(),
      meetingPlatform: item.meeting_platform || "Zoom",
      meetingLink: item.meeting_link || "",
      status: item.status || "scheduled",
      remarks: item.remarks || ""
    }));

    return NextResponse.json(serializeBigInt(payload));
  } catch (error: any) {
    console.error("GET Interviews Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await requireRole("va");
    
    const profile = await db.va_profiles.findUnique({
      where: { user_id: BigInt(currentUser.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "VA Profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { interviewId, proposedTime, message } = body;

    if (!interviewId || !proposedTime) {
      return NextResponse.json({ error: "Interview ID and proposed time are required" }, { status: 400 });
    }

    const interview = await db.interviews.findFirst({
      where: {
        id: BigInt(interviewId),
        job_applications: {
          va_profile_id: profile.id
        }
      }
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview record not found" }, { status: 404 });
    }

    await db.interviews.update({
      where: { id: interview.id },
      data: {
        scheduled_at: new Date(proposedTime),
        status: "rescheduled",
        remarks: message || undefined
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PATCH Reschedule Interview Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
