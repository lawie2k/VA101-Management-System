import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

// Needed to properly serialize BigInts
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET() {
  try {
    await requireRole("admin");

    const assignments = await prisma.assignments.findMany({
      orderBy: { created_at: "desc" },
      include: {
        va_profiles: {
          include: { users: true }
        },
        client_profiles: true,
        job_posts: true
      }
    });

    const formattedAssignments = assignments.map((asg) => {
      const vaRate = asg.job_posts?.va_hourly_rate ? `$${Number(asg.job_posts.va_hourly_rate)}/hr` : "N/A";
      const statusStr = asg.status === "active" ? "Active" : asg.status === "completed" ? "Completed" : asg.status === "paused" ? "Paused" : "Active";

      return {
        id: `ASG-${asg.id}`,
        va: asg.va_profiles?.users?.full_name || "Unknown VA",
        client: asg.client_profiles?.company_name || "Unknown Client",
        job: asg.job_posts?.job_title || "Unknown Job",
        rate: vaRate,
        hrs: "40", // Hardcoded fallback for now since it's not strictly on the job post table schema.
        status: statusStr
      };
    });

    return NextResponse.json({ assignments: formattedAssignments });

  } catch (error) {
    console.error("Failed to fetch assignments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
