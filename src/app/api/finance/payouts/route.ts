import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    
    let whereClause = {};
    if (user.roles.includes("va")) {
      // VA can only see their own payouts
      whereClause = { recipient_user_id: BigInt(user.id) };
    } else if (!user.roles.some(r => ["admin", "finance", "super_admin"].includes(r))) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const payouts = await prisma.payouts.findMany({
      where: whereClause,
      include: {
        users_payouts_recipient_user_idTousers: {
          select: { full_name: true, email: true, user_roles: { include: { roles: true } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = payouts.map((p: any) => ({
      id: p.id.toString(),
      recipientName: `${p.users_payouts_recipient_user_idTousers?.full_name || ''}`.trim() || p.users_payouts_recipient_user_idTousers?.email || "Unknown VA",
      amount: Number(p.amount),
      status: p.status,
      payPeriod: p.pay_period || "Monthly",
      date: p.created_at?.toISOString() || null,
      payslipUrl: p.payslip_url || null,
      roles: p.users_payouts_recipient_user_idTousers?.user_roles?.map((ur: any) => ur.roles.name) || []
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
