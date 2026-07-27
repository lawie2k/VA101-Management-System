import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  try {
    await requireRole("admin");

    const logs = await prisma.admin_logs.findMany({
      orderBy: { created_at: "desc" },
      include: {
        users: {
          select: {
            full_name: true,
            email: true,
          }
        }
      },
      take: 200 // limit to recent 200 logs for performance
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
