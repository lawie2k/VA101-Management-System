import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole, requireAuth } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole("admin", "finance", "super_admin");
    const invoices = await prisma.invoices.findMany({
      include: {
        client_profiles: true,
        invoice_receipts: true
      },
      orderBy: { created_at: 'desc' }
    });

    // Format for frontend
    const formatted = invoices.map((inv: any) => ({
      id: inv.id.toString(),
      invoiceNumber: inv.invoice_number,
      clientName: inv.client_profiles?.company_name || "Unknown Client",
      amount: Number(inv.amount),
      dueDate: inv.due_date?.toISOString() || null,
      status: inv.status,
      receipts: inv.invoice_receipts.map((r: any) => ({
        id: r.id.toString(),
        fileUrl: r.file_url,
        status: r.verification_status
      }))
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}


export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user.roles.some((r: string) => ["admin", "finance", "super_admin"].includes(r))) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await req.json();
    const { client_profile_id, amount, due_date, billing_cycle } = body;

    if (!client_profile_id || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique invoice number
    const timestamp = Date.now().toString().slice(-6);
    const invoice_number = `INV-${timestamp}`;

    const newInvoice = await prisma.invoices.create({
      data: {
        client_profile_id: BigInt(client_profile_id),
        invoice_number,
        amount: parseFloat(amount),
        due_date: due_date ? new Date(due_date) : null,
        billing_cycle: billing_cycle || null,
        status: "unpaid",
        created_by: BigInt(user.id),
      }
    });

    return NextResponse.json({ 
      success: true, 
      invoice: {
        ...newInvoice,
        id: newInvoice.id.toString(),
        client_profile_id: newInvoice.client_profile_id.toString(),
        created_by: newInvoice.created_by?.toString()
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
