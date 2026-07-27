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

    return NextResponse.json({ notices });
  } catch (error) {
    console.error("Error fetching global notices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
