import { NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/db";
import { requireRole } from "../../../../lib/auth";

function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    if (obj instanceof Date) return obj.toISOString();
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = serializeBigInt(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export async function GET(req: Request) {
  try {
    const currentUser = await requireRole("va");
    
    const vaProfile = await prisma.va_profiles.findUnique({
      where: { user_id: BigInt(currentUser.id) }
    });

    if (!vaProfile) {
      return NextResponse.json({ error: "VA Profile not found" }, { status: 404 });
    }

    const tasks = await prisma.tasks.findMany({
      where: { va_profile_id: vaProfile.id },
      include: {
        client_profiles: {
          include: { users: { select: { full_name: true } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const assignments = await prisma.assignments.findMany({
      where: { va_profile_id: vaProfile.id, status: 'active' },
      include: {
        client_profiles: {
          include: { users: { select: { full_name: true, profile_photo_url: true } } }
        },
        job_posts: {
          select: { job_title: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: serializeBigInt(tasks), assignments: serializeBigInt(assignments) });
  } catch (err) {
    console.error("Failed to fetch VA tasks:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

  export async function PATCH(req: Request) {
    try {
      const currentUser = await requireRole("va");
      const body = await req.json();
      const { taskId, status, submissionLink } = body;
  
      if (!taskId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const vaProfile = await prisma.va_profiles.findUnique({
      where: { user_id: BigInt(currentUser.id) }
    });

    if (!vaProfile) {
      return NextResponse.json({ error: "VA Profile not found" }, { status: 404 });
    }

    // Verify task belongs to VA
    const task = await prisma.tasks.findFirst({
      where: { id: BigInt(taskId), va_profile_id: vaProfile.id }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found or access denied" }, { status: 403 });
    }

      const updateData: any = { status, updated_at: new Date() };
      if (submissionLink !== undefined) {
        updateData.submission_link = submissionLink || null;
      }
  
      await prisma.tasks.update({
        where: { id: BigInt(taskId) },
        data: updateData
      });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update task:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
