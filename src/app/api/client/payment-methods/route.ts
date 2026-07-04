import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";
import { veem } from "@/src/lib/veem";

export async function GET(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.veem_account_id) {
      return NextResponse.json({ paymentMethods: [] });
    }

    // Mock Veem funding sources
    // In a real implementation, we would call:
    // await fetch(`https://sandbox-api.veem.com/veem/v1.1/funding-sources`, { headers: await veem.getHeaders() })
    const formattedMethods = [
      {
        id: "veem_fs_1",
        brand: "Bank Account",
        last4: "3294",
        expMonth: null,
        expYear: null,
      }
    ];

    return NextResponse.json({ paymentMethods: formattedMethods });
  } catch (error) {
    console.error("Failed to fetch payment methods:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
