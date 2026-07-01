import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";

import { requireRole } from "../../../../lib/auth";

export async function GET(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const clientProfile = await prisma.client_profiles.findUnique({
      where: { user_id: BigInt(userId) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    const rawInvoices = await prisma.invoices.findMany({
      where: {
        client_profile_id: clientProfile.id
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = rawInvoices.map(inv => ({
      id: inv.id.toString(),
      invoiceNumber: inv.invoice_number,
      date: inv.due_date ? inv.due_date.toISOString().split('T')[0] : "TBD",
      amount: `$${inv.amount.toString()}`,
      status: inv.status === "paid" ? "Paid" : (inv.status === "unpaid" ? "Upcoming" : inv.status),
      description: `Invoice ${inv.invoice_number}`,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
