import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

// Helper to serialize BigInt fields to strings before JSON output
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = serializeBigInt(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export async function POST(req: Request) {
  try {
    await requireRole("client");

    const body = await req.json();
    const { shortlistId, meetingLink, scheduledDate } = body;

    if (!shortlistId || !meetingLink || !scheduledDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Lookup the shortlist to find the job_application_id
    const shortlist = await db.shortlists.findUnique({
      where: { id: BigInt(shortlistId) }
    });

    if (!shortlist) {
      return NextResponse.json({ error: "Shortlist record not found" }, { status: 404 });
    }

    // 1. Create the interview record
    await db.interviews.create({
      data: {
        job_application_id: shortlist.job_application_id,
        interview_type: "client",
        scheduled_at: new Date(scheduledDate),
        status: "Scheduled",
        result: "Pending",
        meeting_link: meetingLink
      }
    });

    // 2. Update the job application status
    await db.job_applications.update({
      where: { id: shortlist.job_application_id },
      data: {
        status: "client_interview_scheduled"
      }
    });

    // 3. Update the shortlist status itself just for consistency
    await db.shortlists.update({
      where: { id: shortlist.id },
      data: {
        status: "interviewing"
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST Client Schedule Interview Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
