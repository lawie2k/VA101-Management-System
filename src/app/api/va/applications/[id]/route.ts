import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { requireRole } from "../../../../../lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await requireRole("va");

    const profile = await db.va_profiles.findUnique({
      where: { user_id: BigInt(currentUser.id) },
    });

    if (!profile) {
      return NextResponse.json({ error: "VA Profile not found" }, { status: 404 });
    }

    // Verify application belongs to VA
    const application = await db.job_applications.findUnique({
      where: { id: BigInt(id) },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.va_profile_id !== profile.id) {
      return NextResponse.json({ error: "Unauthorized to delete this application" }, { status: 403 });
    }

    // Only allow withdrawing if not hired
    if (application.status === "hired" || application.status === "contracted") {
       return NextResponse.json({ error: "Cannot withdraw an application after being hired" }, { status: 400 });
    }

    await db.job_applications.update({
      where: { id: BigInt(id) },
      data: { status: "withdrawn" }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Application Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete application" }, { status: 500 });
  }
}
