import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

// Needed to properly serialize BigInts
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET() {
  try {
    await requireRole("admin", "employee");

    const interviews = await prisma.interviews.findMany({
      where: { interview_type: "initial" },
      orderBy: { created_at: "desc" },
      include: {
        job_applications: {
          include: {
            va_profiles: {
              include: {
                users: true
              }
            },
            job_posts: true
          }
        }
      }
    });

    const formattedInterviews = interviews.map((interview) => {
      // Format the date string
      const dateStr = interview.scheduled_at 
        ? new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short"
          }).format(interview.scheduled_at)
        : "TBD";

      return {
        id: interview.id.toString(),
        job_application_id: interview.job_application_id.toString(),
        va: interview.job_applications?.va_profiles?.users?.full_name || "Unknown VA",
        job: interview.job_applications?.job_posts?.job_title || "Unknown Job",
        date: dateStr,
        status: interview.status || "Scheduled",
        result: interview.result || "Pending"
      };
    });

    return NextResponse.json({ interviews: formattedInterviews });

  } catch (error) {
    console.error("Failed to fetch initial interviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole("admin", "employee");
    const { interviewId, result } = await req.json();

    if (!interviewId || !result) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newStatus = result === "Passed" || result === "Failed" ? "Completed" : "Scheduled";

    // Update the interview record
    const updatedInterview = await prisma.interviews.update({
      where: { id: BigInt(interviewId) },
      data: { result, status: newStatus },
      include: { job_applications: true }
    });

    // If passed, update application status and create shortlist
    if (result === "Passed") {
      await prisma.job_applications.update({
        where: { id: updatedInterview.job_application_id },
        data: { status: "shortlisted_to_client" }
      });

      // Attempt to create a shortlist if client profile exists
      // Wait, the client profile might not be known immediately unless we link it to the job post.
      // A job post belongs to a client. Let's find the client profile ID for the job.
      const jobPost = await prisma.job_posts.findUnique({
        where: { id: updatedInterview.job_applications.job_post_id }
      });

      if (jobPost && jobPost.client_profile_id) {
        // Create shortlist record
        await prisma.shortlists.create({
          data: {
            job_application_id: updatedInterview.job_application_id,
            client_profile_id: jobPost.client_profile_id,
            status: "shortlisted"
          }
        });
      }
    } else if (result === "Failed") {
      await prisma.job_applications.update({
        where: { id: updatedInterview.job_application_id },
        data: { status: "initial_interview_failed" }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Failed to update interview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
