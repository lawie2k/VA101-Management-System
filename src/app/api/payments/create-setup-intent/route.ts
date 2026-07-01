import { NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import { db as prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, successUrl, cancelUrl } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      
      await prisma.users.update({
        where: { id: user.id },
        data: { stripe_customer_id: customerId }
      });
    }

    // Create a Checkout Session for setting up a payment method
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "setup",
      customer: customerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating setup session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
