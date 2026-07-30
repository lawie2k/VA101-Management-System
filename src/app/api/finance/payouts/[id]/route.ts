import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    if (!user.roles.some((r: string) => ["admin", "finance", "super_admin"].includes(r))) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { id: paramId } = await params;
    const id = BigInt(paramId);
    const body = await req.json();
    const { status, payslip_url } = body;

    const updated = await prisma.payouts.update({
      where: { id },
      data: {
        status: status || "paid",
        payslip_url: payslip_url || null,
        processed_by: BigInt(user.id),
        processed_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      payout: {
        ...updated,
        id: updated.id.toString(),
        processed_by: updated.processed_by?.toString()
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
