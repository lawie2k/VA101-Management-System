import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole("admin", "finance", "super_admin");

    // Total receivables (Unpaid Invoices)
    const unpaidInvoices = await prisma.invoices.aggregate({
      _sum: { amount: true },
      where: { status: "unpaid" }
    });
    const totalReceivables = Number(unpaidInvoices._sum.amount || 0);

    // Total Payables (Pending Payouts)
    const pendingPayouts = await prisma.payouts.aggregate({
      _sum: { amount: true },
      where: { status: "pending" }
    });
    const totalPayables = Number(pendingPayouts._sum.amount || 0);

    // Total Commissions (Month to Date roughly - ignoring date for mock simplicity)
    const totalCommissionsData = await prisma.commissions.aggregate({
      _sum: { platform_commission_amount: true }
    });
    const totalCommissions = Number(totalCommissionsData._sum.platform_commission_amount || 0);

    // Action Items (Pending Verifications)
    const pendingPayments = await prisma.payments.count({ where: { status: "pending" } });
    const pendingReceipts = await prisma.invoice_receipts.count({ where: { verification_status: "pending_review" } });
    const totalActionItems = pendingPayments + pendingReceipts;

    return NextResponse.json({
      metrics: {
        totalReceivables,
        totalPayables,
        totalCommissions,
        actionItems: totalActionItems
      }
    });
  } catch (err: any) {
    console.error("Finance Dashboard Error:", err);
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
