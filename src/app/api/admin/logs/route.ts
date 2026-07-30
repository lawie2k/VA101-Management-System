import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  try {
    await requireRole("admin");

    const logs = await prisma.logs.findMany({
      orderBy: { created_at: "desc" },
      include: {
        users_logs_created_byTousers: {
          select: {
            full_name: true,
            email: true,
          }
        }
      },
      take: 200 // limit to recent 200 logs for performance
    });

    // Map the relation to `users` to match frontend expectations
    const mappedLogs = logs.map(log => ({
      ...log,
      users: log.users_logs_created_byTousers
    }));

    return NextResponse.json({ logs: mappedLogs });
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
