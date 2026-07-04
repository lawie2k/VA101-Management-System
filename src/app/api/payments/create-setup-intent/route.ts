import { NextResponse } from "next/server";
import { veem } from "@/src/lib/veem";
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

    // Veem doesn't have a "setup intent" for cards like Stripe.
    // Instead, this route would typically redirect the user to Veem's OAuth authorization page.
    const veemClientId = process.env.VEEM_CLIENT_ID || "test_client_id";
    const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/payments/veem-callback`);
    
    // Construct the Veem OAuth URL
    const veemAuthUrl = `https://sandbox-api.veem.com/oauth/authorize?client_id=${veemClientId}&response_type=code&redirect_uri=${redirectUri}&state=${userId}`;

    return NextResponse.json({ url: veemAuthUrl });
  } catch (error) {
    console.error("Error creating setup session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
