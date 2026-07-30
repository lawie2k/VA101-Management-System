import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole("admin", "finance", "super_admin");
    const commissions = await prisma.commissions.findMany({
      include: {
        users: { select: { full_name: true, email: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = commissions.map((c: any) => ({
      id: c.id.toString(),
      recipientName: `${c.users?.full_name || ''}`.trim() || "Unknown",
      recipientType: c.recipient_type,
      grossAmount: Number(c.gross_amount),
      platformAmount: Number(c.platform_commission_amount),
      recipientAmount: Number(c.recipient_amount),
      status: c.status,
      date: c.created_at?.toISOString() || null
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
