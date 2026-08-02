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

    // Recent Payouts (Top 10 Pending)
    const rawPayouts = await prisma.payouts.findMany({
      where: { status: "pending" },
      orderBy: { created_at: "desc" },
      take: 10
    });
    
    // Fetch users for the payouts
    const userIds = rawPayouts.map(p => p.recipient_user_id);
    const users = await prisma.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, full_name: true }
    });
    const userMap = new Map(users.map(u => [u.id.toString(), u.full_name]));

    const recentPayouts = rawPayouts.map(p => ({
      id: p.id.toString(),
      name: userMap.get(p.recipient_user_id.toString()) || "Unknown User",
      amount: `$${Number(p.amount).toFixed(2)}`,
      date: p.pay_period || "Pending",
      status: p.status
    }));

    // Recent Invoices (Top 10 Unpaid/Overdue)
    const rawInvoices = await prisma.invoices.findMany({
      where: { status: { not: "paid" } },
      orderBy: { due_date: "asc" },
      take: 10,
      include: {
        client_profiles: {
          select: { company_name: true }
        }
      }
    });

    const recentInvoices = rawInvoices.map(inv => ({
      id: inv.id.toString(),
      client: inv.client_profiles?.company_name || "Unknown Client",
      invoiceNumber: inv.invoice_number,
      amount: `$${Number(inv.amount).toFixed(2)}`,
      status: inv.status
    }));

    return NextResponse.json({
      metrics: {
        totalReceivables,
        totalPayables,
        totalCommissions,
        actionItems: totalActionItems
      },
      queues: {
        recentPayouts,
        recentInvoices
      }
    });
  } catch (err: any) {
    console.error("Finance Dashboard Error:", err);
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
