import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { veem } from "@/src/lib/veem";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // Contains the userId we passed
    const error = url.searchParams.get("error");

    if (error) {
      console.error("Veem OAuth Error:", error);
      return NextResponse.redirect(new URL("/trainer/settings?veem_error=true", req.url));
    }

    if (!code || !state) {
      return NextResponse.json({ error: "Missing authorization code or state" }, { status: 400 });
    }

    const userId = BigInt(state);

    // Reconstruct the redirect URI
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/payments/veem-callback`;

    // Exchange the authorization code for an access token
    const tokenData = await veem.exchangeCodeForToken(code, redirectUri);

    // Save the token data to the user's profile
    await prisma.users.update({
      where: { id: userId },
      data: { 
        veem_token: tokenData.access_token,
        // Veem often returns an account ID or similar depending on the exact flow,
        // but typically the access token is sufficient for future B2B API calls on their behalf
        // veem_account_id: tokenData.user_id 
      }
    });

    // Successfully connected! Redirect back to the trainer dashboard.
    // In a real app, you might want to decode which dashboard they came from based on state,
    // but for now we default to trainer settings.
    return NextResponse.redirect(new URL("/trainer/settings?veem_connected=true", req.url));
  } catch (error) {
    console.error("Veem Callback Error:", error);
    return NextResponse.redirect(new URL("/trainer/settings?veem_error=true", req.url));
  }
}
