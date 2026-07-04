import { NextResponse } from "next/server";
import { veem } from "@/src/lib/veem";
import { db as prisma } from "@/src/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("X-VEEM-SIGNATURE");

  const webhookSecret = process.env.VEEM_WEBHOOK_SECRET;
  
  if (!signature || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  // Verify Veem webhook signature (HMAC SHA256)
  const hmac = crypto.createHmac("sha256", webhookSecret);
  const digest = hmac.update(payload).digest("base64");
  
  if (signature !== digest) {
    console.error("Webhook signature verification failed");
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // Parse Veem webhook event
  let event;
  try {
    event = JSON.parse(payload);
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  // Handle the event securely inside a transaction when writing to the DB
  try {
    switch (event.eventType) {
      case "PaymentStatusChanged": {
        const payment = event.payment;
        const invoiceId = payment.externalInvoiceRefId;
        
        if (invoiceId && payment.status === "Sent") {
          // Use transaction to ensure safe status transition
          await prisma.$transaction(async (tx) => {
            // Find invoice by its internal invoice_number which we passed as externalInvoiceRefId
            const invoice = await tx.invoices.findUnique({
              where: { invoice_number: invoiceId }
            });
            
            if (invoice && invoice.status !== "paid") {
              await tx.invoices.update({
                where: { id: invoice.id },
                data: {
                  status: "paid",
                  veem_payment_id: payment.id,
                }
              });
            }
          });
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
