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

    // 1. Jobs Posted (active/pending)
    const jobsCount = await prisma.job_posts.count({
      where: {
        client_profile_id: clientProfile.id,
        status: {
          in: ["active", "pending_review"],
        },
      },
    });

    // 2. VAs Hired (active assignments)
    const vasHiredCount = await prisma.assignments.count({
      where: {
        client_profile_id: clientProfile.id,
        status: "active",
      },
    });

    // 3. Interviews (Pending/Scheduled for this client's jobs)
    const interviewsCount = await prisma.interviews.count({
      where: {
        job_applications: {
          job_posts: {
            client_profile_id: clientProfile.id,
          },
        },
        status: "scheduled",
      },
    });

    // 4. Contracts (count of contracts for this client)
    const contractsCount = await prisma.contracts.count({
      where: {
        client_profile_id: clientProfile.id,
        status: "active",
      },
    });

    return NextResponse.json({
      jobsPosted: jobsCount,
      vasHired: vasHiredCount,
      interviews: interviewsCount,
      contracts: contractsCount,
    });
  } catch (error) {
    console.error("Failed to fetch hiring overview stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
