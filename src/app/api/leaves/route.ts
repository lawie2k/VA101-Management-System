import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    const leaves = await prisma.leave_requests.findMany({
      where: { user_id: BigInt(user.id) },
      orderBy: { created_at: "desc" }
    });

    // Convert BigInts to string for JSON serialization
    const serializedLeaves = leaves.map(leave => ({
      ...leave,
      id: leave.id.toString(),
      user_id: leave.user_id.toString(),
      reviewed_by: leave.reviewed_by?.toString() || null
    }));

    return NextResponse.json({ leaves: serializedLeaves });
  } catch (error: any) {
    console.error("Failed to fetch leaves:", error);
    if (error.name === "AuthError") {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const { leaveType, startDate, endDate, reason } = await req.json();

    if (!leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newLeave = await prisma.leave_requests.create({
      data: {
        user_id: BigInt(user.id),
        leave_type: leaveType,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        reason: reason,
        status: "pending"
      }
    });

    const serializedLeave = {
      ...newLeave,
      id: newLeave.id.toString(),
      user_id: newLeave.user_id.toString(),
      reviewed_by: newLeave.reviewed_by?.toString() || null
    };

    return NextResponse.json({ success: true, leave: serializedLeave });
  } catch (error: any) {
    console.error("Failed to create leave request:", error);
    if (error.name === "AuthError") {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
