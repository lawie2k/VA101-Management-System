import { NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
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

    // Determine or create Stripe Customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name || undefined,
        metadata: {
          userId: user.id.toString(),
        }
      });
      customerId = customer.id;
      
      // Save customer ID in DB
      await prisma.users.update({
        where: { id: user.id },
        data: { stripe_customer_id: customerId }
      });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: invoice.currency?.toLowerCase() || "usd",
            product_data: {
              name: `Invoice #${invoice.invoice_number}`,
            },
            unit_amount: Math.round(Number(invoice.amount) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: invoice.id.toString(),
      metadata: {
        invoiceId: invoice.id.toString(),
      }
    });

    // Save checkout session ID to invoice
    await prisma.invoices.update({
      where: { id: invoice.id },
      data: { stripe_checkout_session_id: session.id }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
