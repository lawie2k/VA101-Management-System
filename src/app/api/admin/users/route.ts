import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    const sessionUser = await requireRole("admin");
    const isSuperAdmin = sessionUser.roles.includes("admin");

    // Fetch users who have external profiles
    const externalUsersRaw = await prisma.users.findMany({
      where: {
        OR: [
          { va_profiles: { isNot: null } },
          { client_profiles: { isNot: null } },
          { student_profiles: { isNot: null } },
          { trainer_profiles: { isNot: null } }
        ]
      },
      include: {
        va_profiles: true,
        client_profiles: true,
        student_profiles: true,
        trainer_profiles: true
      },
      orderBy: { created_at: 'desc' }
    });

    const formattedUsers = externalUsersRaw.map(user => {
      let role = "Unknown";
      let status = user.account_status || "Active";
      
      if (user.va_profiles) {
        role = "Va";
        status = user.va_profiles.profile_status === "draft" ? "Pending" : user.account_status || "Active";
      } else if (user.client_profiles) {
        role = "Client";
        status = user.client_profiles.status || "Active";
      } else if (user.student_profiles) {
        role = "Student";
        status = user.student_profiles.status || "Active";
      } else if (user.trainer_profiles) {
        role = "Trainer";
        status = user.trainer_profiles.status || "Active";
      }

      return {
        id: user.id.toString(),
        name: user.full_name || (user.client_profiles ? user.client_profiles.company_name : "Unknown User"),
        email: user.email,
        role,
        joined: user.created_at ? user.created_at.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Unknown",
        status: status.charAt(0).toUpperCase() + status.slice(1)
      };
    });

    return NextResponse.json({ users: formattedUsers, isSuperAdmin });

  } catch (error) {
    console.error("Failed to fetch external users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
