import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/auth";

export async function PUT(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const { notifications } = body;

    const updatedUser = await prisma.users.update({
      where: { id: BigInt(user.id) },
      data: {
        notification_prefs: notifications,
        updated_at: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      notificationPrefs: updatedUser.notification_prefs
    });
  } catch (error: any) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.status || 500 }
    );
  }
}
