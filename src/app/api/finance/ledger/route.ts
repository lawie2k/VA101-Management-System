import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole("admin", "finance", "super_admin");
    const logs = await prisma.logs.findMany({
      where: {
        log_type: {
          in: ["payment_verified", "invoice_approved", "payout_processed", "commission_generated"]
        }
      },
      include: {
        users_logs_created_byTousers: { select: { full_name: true, email: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = logs.map((l: any) => ({
      id: l.id.toString(),
      type: l.log_type,
      title: l.title,
      description: l.description,
      actor: `${l.users_logs_created_byTousers?.full_name || ''}`.trim() || "System",
      date: l.created_at?.toISOString() || null
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
