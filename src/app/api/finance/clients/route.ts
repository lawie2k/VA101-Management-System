import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    if (!user.roles.some((r: string) => ["admin", "finance", "super_admin"].includes(r))) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const clients = await prisma.client_profiles.findMany({
      where: {
        status: "active"
      },
      select: {
        id: true,
        company_name: true,
        users: {
          select: {
            full_name: true,
            email: true
          }
        }
      },
      orderBy: {
        company_name: "asc"
      }
    });

    const formatted = clients.map((c: any) => ({
      id: c.id.toString(),
      companyName: c.company_name,
      contactName: c.users?.full_name || c.users?.email || "Unknown"
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
