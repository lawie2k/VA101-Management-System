import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.roles) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role mapping for notices
    // Ensure we handle roles array appropriately
    const userRoles = session.user.roles.map((r: string) => r.toLowerCase());
    
    // Convert DB roles to Notice Audience Labels
    const noticeAudiences = ["All users"];
    if (userRoles.includes("admin")) noticeAudiences.push("Admins");
    if (userRoles.includes("finance")) noticeAudiences.push("Finance");
    if (userRoles.includes("employee")) noticeAudiences.push("Employees");
    if (userRoles.includes("client")) noticeAudiences.push("Clients");
    if (userRoles.includes("va")) noticeAudiences.push("VAs");
    if (userRoles.includes("trainer")) noticeAudiences.push("Trainers");
    if (userRoles.includes("student")) noticeAudiences.push("Students");

    const notices = await prisma.notices.findMany({
      where: {
        audience_type: {
          in: noticeAudiences
        },
        // We only show notices created in the last 30 days to avoid clutter
        created_at: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { created_at: "desc" },
      take: 20
    });

    let finalNotices: any[] = [...notices];

    // Inject personal hired notices for VAs
    if (userRoles.includes("va")) {
      const vaProfile = await prisma.va_profiles.findUnique({
        where: { user_id: BigInt(session.user.id) }
      });

      if (vaProfile) {
        const hiredApps = await prisma.job_applications.findMany({
          where: {
            va_profile_id: vaProfile.id,
            status: "hired"
          },
          include: {
            job_posts: {
              include: { client_profiles: true }
            }
          },
          orderBy: { updated_at: "desc" },
          take: 5
        });

        const hiredNotices = hiredApps.map((app: any) => ({
          id: `hired-${app.id.toString()}`,
          title: "🎉 Congratulations! You've been Hired!",
          message: `You are hired for the ${app.job_posts?.job_title} role at ${app.job_posts?.client_profiles?.company_name || "a client"}. Check your Tasks and Contracts!`,
          audience_type: "Personal",
          priority: "normal",
          created_at: app.updated_at || app.applied_at || new Date()
        }));

        // Put hired notices at the top
        finalNotices = [...hiredNotices, ...finalNotices];
      }
    }

    // Sort combined array by created_at desc
    finalNotices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ notices: finalNotices });
  } catch (error) {
    console.error("Error fetching global notices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
