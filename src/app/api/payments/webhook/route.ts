import { NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import { db as prisma } from "@/src/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!signature || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // Handle the event securely inside a transaction when writing to the DB
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === "payment") {
          const invoiceId = session.metadata?.invoiceId;
          
          if (invoiceId) {
            // Use transaction to ensure safe status transition
            await prisma.$transaction(async (tx) => {
              const invoice = await tx.invoices.findUnique({
                where: { id: BigInt(invoiceId) }
              });
              
              if (invoice && invoice.status !== "paid") {
                await tx.invoices.update({
                  where: { id: invoice.id },
                  data: {
                    status: "paid",
                    stripe_payment_intent_id: session.payment_intent as string,
                  }
                });
                
                // We could also record a payment entry in the payments table here
              }
            });
          }
        }
        break;
      }
      
      // More events could be handled here (like setup_intent.succeeded)
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
