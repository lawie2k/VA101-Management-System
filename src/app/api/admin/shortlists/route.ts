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

    const shortlists = await prisma.shortlists.findMany({
      orderBy: { created_at: "desc" },
      include: {
        job_applications: {
          include: {
            va_profiles: {
              include: {
                users: true
              }
            },
            job_posts: {
              include: {
                niches: true
              }
            }
          }
        }
      }
    });

    const formattedShortlists = shortlists.map((sl) => {
      let displayStatus = "Shortlisted To Client";
      const rawStatus = sl.job_applications?.status;

      if (rawStatus === "client_interview_scheduled") displayStatus = "Client Interview Scheduled";
      else if (rawStatus === "hired") displayStatus = "Hired";
      else if (rawStatus === "rejected") displayStatus = "Rejected";

      return {
        id: `APP-${sl.job_application_id}`,
        name: sl.job_applications?.va_profiles?.users?.full_name || "Unknown VA",
        job: sl.job_applications?.job_posts?.job_title || "Unknown Job",
        niche: sl.job_applications?.job_posts?.niches?.name || "Uncategorized",
        match: sl.job_applications?.match_score ? `${sl.job_applications.match_score}%` : "N/A",
        status: displayStatus
      };
    });

    return NextResponse.json({ shortlists: formattedShortlists });

  } catch (error) {
    console.error("Failed to fetch shortlists:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
