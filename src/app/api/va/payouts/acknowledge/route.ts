import { NextResponse } from "next/server";
import { db as prisma } from "../../../../../lib/db";
import { requireRole } from "../../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("va");
    
    const body = await req.json();
    const { payoutId } = body;

    if (!payoutId) {
      return NextResponse.json({ error: "Payout ID is required" }, { status: 400 });
    }

    // Verify payout belongs to the VA
    const payout = await prisma.payouts.findFirst({
      where: {
        id: BigInt(payoutId),
        recipient_user_id: BigInt(currentUser.id)
      }
    });

    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }

    // Update payout to acknowledged
    await prisma.payouts.update({
      where: { id: BigInt(payoutId) },
      data: {
        payslip_acknowledged: true
      }
    });

    return NextResponse.json({ success: true, message: "Payslip acknowledged successfully" });
  } catch (err) {
    console.error("Failed to acknowledge payslip:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
