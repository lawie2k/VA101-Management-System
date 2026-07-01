import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    // Find the client profile for this user
    const clientProfile = await prisma.client_profiles.findUnique({
      where: { user_id: BigInt(userId) },
    });

    if (!clientProfile) {
      return NextResponse.json(
        { error: "Client profile not found" },
        { status: 404 }
      );
    }

    // 1. Matches (Job Applications to this client's job posts with status applied/pending)
    const matchesCount = await prisma.job_applications.count({
      where: {
        job_posts: {
          client_profile_id: clientProfile.id,
        },
        status: {
          in: ["applied", "pending"],
        },
      },
    });

    // 2. Shortlisted Count
    const shortlistedCount = await prisma.shortlists.count({
      where: {
        client_profile_id: clientProfile.id,
      },
    });

    // 3. Interviews (Pending/Scheduled interviews for this client's applications)
    const interviewsCount = await prisma.interviews.count({
      where: {
        job_applications: {
          job_posts: {
            client_profile_id: clientProfile.id,
          },
        },
        status: {
          in: ["scheduled"],
        },
      },
    });

    return NextResponse.json({
      matches: matchesCount,
      shortlisted: shortlistedCount,
      interviews: interviewsCount,
    });
  } catch (error) {
    console.error("Failed to fetch hiring pipeline stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
