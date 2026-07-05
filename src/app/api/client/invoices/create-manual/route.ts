import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const body = await req.json();
    const { amount, description, gateway } = body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const clientProfile = await prisma.client_profiles.findUnique({
      where: { user_id: BigInt(userId) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    // Create the self-initiated invoice
    const newInvoice = await prisma.invoices.create({
      data: {
        client_profile_id: clientProfile.id,
        invoice_number: `PMT-${Date.now()}`,
        amount: Number(amount),
        currency: "USD",
        status: "unpaid",
        created_by: BigInt(userId),
        // Storing the description into billing_cycle temporarily to hold the purpose 
        // since there's no native description field in the schema, 
        // OR wait, invoices table has invoice_number. Wait, where was description coming from? 
        // In PaymentsMainFeed we do: invoice.description
        // Let's check how the previous GET endpoint fetched description
        // It does: description: `Invoice ${inv.invoice_number}`
        billing_cycle: description || `Self-initiated payment via ${gateway}`
      }
    });

    return NextResponse.json({ success: true, invoiceId: newInvoice.id.toString() });
  } catch (error) {
    console.error("Failed to create manual invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
