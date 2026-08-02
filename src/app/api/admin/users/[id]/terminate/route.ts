import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Ensure caller is a super admin
    await requireRole("admin");

    const resolvedParams = await params;
    const targetUserId = BigInt(resolvedParams.id);

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // 2. Look up the target user
    const user = await db.users.findUnique({
      where: { id: targetUserId },
      include: {
        va_profiles: true,
        client_profiles: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.account_status === "terminated") {
      return NextResponse.json({ error: "User is already terminated" }, { status: 400 });
    }

    // 3. Execute all updates in a Prisma Transaction to prevent partial states
    await db.$transaction(async (tx) => {
      // Step A: Mark the user account as terminated (Soft Delete)
      await tx.users.update({
        where: { id: targetUserId },
        data: { account_status: "terminated" }
      });

      // Step B: Terminate contracts and assignments if they are a VA
      if (user.va_profiles) {
        const vaProfileId = user.va_profiles.id;
        
        // Terminate Contracts
        await tx.contracts.updateMany({
          where: { 
            va_profile_id: vaProfileId,
            status: { notIn: ["terminated", "completed", "closed"] }
          },
          data: { status: "terminated" }
        });

        // Terminate Assignments
        await tx.assignments.updateMany({
          where: {
            va_profile_id: vaProfileId,
            status: { notIn: ["terminated", "completed", "closed"] }
          },
          data: { status: "terminated" }
        });
      }

      // Step C: If they are a Client, terminate their active job posts, contracts, and assignments
      if (user.client_profiles) {
        const clientProfileId = user.client_profiles.id;

        // Close Job Posts
        await tx.job_posts.updateMany({
          where: {
            client_profile_id: clientProfileId,
            status: { notIn: ["archived", "closed"] }
          },
          data: { status: "closed" }
        });

        // Terminate Contracts
        await tx.contracts.updateMany({
          where: {
            client_profile_id: clientProfileId,
            status: { notIn: ["terminated", "completed", "closed"] }
          },
          data: { status: "terminated" }
        });

        // Terminate Assignments
        await tx.assignments.updateMany({
          where: {
            client_profile_id: clientProfileId,
            status: { notIn: ["terminated", "completed", "closed"] }
          },
          data: { status: "terminated" }
        });
      }
    });

    return NextResponse.json({ success: true, message: "User successfully terminated." });
  } catch (error: any) {
    console.error("Failed to terminate user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
