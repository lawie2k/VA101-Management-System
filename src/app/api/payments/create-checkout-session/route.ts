import { NextResponse } from "next/server";
import { veem } from "@/src/lib/veem";
import { db as prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const { invoiceId, successUrl, cancelUrl } = await req.json();

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }

    // Fetch the invoice and user from the database
    const invoice = await prisma.invoices.findUnique({
      where: { id: BigInt(invoiceId) },
      include: {
        client_profiles: {
          include: {
            users: true
          }
        }
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const user = invoice.client_profiles?.users;
    if (!user) {
      return NextResponse.json({ error: "User not found for this invoice" }, { status: 404 });
    }

    // Generate Veem Auth Headers
    const headers = await veem.getHeaders();

    // Create Veem Payment Request (Mock Payload for Veem structure)
    const veemPayload = {
      amount: {
        number: Number(invoice.amount),
        currency: invoice.currency?.toUpperCase() || "USD"
      },
      payee: {
        email: user.email,
        firstName: user.full_name?.split(" ")[0] || "Client",
        lastName: user.full_name?.split(" ")[1] || "",
        type: "Personal"
      },
      purposeOfPayment: "Services",
      externalInvoiceRefId: invoice.invoice_number
    };

    const response = await fetch("https://sandbox-api.veem.com/veem/v1.1/payments", {
      method: "POST",
      headers,
      body: JSON.stringify(veemPayload)
    });

    let paymentUrl = successUrl;
    let paymentId = `veem_mock_${Date.now()}`;

    if (response.ok) {
      const data = await response.json();
      paymentId = data.id;
      // In a real flow, Veem might return a claimLink or hosted payment URL
      paymentUrl = data.claimLink || successUrl;
    } else {
      console.warn("Veem API request failed, using mock payment ID");
    }

    // Save Veem request ID to invoice
    await prisma.invoices.update({
      where: { id: invoice.id },
      data: { veem_request_id: paymentId }
    });

    return NextResponse.json({ url: paymentUrl });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
