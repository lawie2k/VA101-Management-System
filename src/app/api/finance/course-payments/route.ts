import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole("admin", "finance", "super_admin");
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "va" or "student"

    let roleFilter = {};
    if (type === "va") {
      roleFilter = { some: { roles: { name: "va" } } };
    } else if (type === "student") {
      roleFilter = { some: { roles: { name: { in: ["student", "client"] } } } };
    }

    const payments = await prisma.payments.findMany({
      where: Object.keys(roleFilter).length > 0 ? {
        users_payments_payer_user_idTousers: { user_roles: roleFilter }
      } : {},
      include: {
        users_payments_payer_user_idTousers: {
          select: { full_name: true, email: true }
        },
        payment_proofs: true
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = payments.map((p: any) => ({
      id: p.id.toString(),
      payerName: `${p.users_payments_payer_user_idTousers?.full_name || ''}`.trim() || p.users_payments_payer_user_idTousers?.email || "Unknown Payer",
      amount: Number(p.amount_paid),
      type: p.payment_type, // e.g. "Course Purchase", "Deposit"
      status: p.status,
      date: p.created_at?.toISOString() || null,
      proofs: p.payment_proofs?.map((proof: any) => ({
        id: proof.id.toString(),
        fileUrl: proof.file_url
      })) || []
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
