import { NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/db";
import { requireRole } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const body = await req.json();
    const { vaProfileId, title, description, dueDate, resourceLink } = body;

    if (!vaProfileId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const clientProfile = await prisma.client_profiles.findFirst({
      where: { user_id: BigInt(currentUser.id) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    const task = await prisma.tasks.create({
      data: {
        va_profile_id: BigInt(vaProfileId),
        client_profile_id: clientProfile.id,
        title,
        description: description || null,
        resource_link: resourceLink || null,
        due_date: dueDate ? new Date(dueDate) : null,
      }
    });

    return NextResponse.json({ success: true, taskId: task.id.toString() });
  } catch (err) {
    console.error("Failed to create task:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
