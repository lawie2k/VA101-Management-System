import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { requireRole } from "../../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("student");
    const body = await req.json();
    const { purchaseId, receiptUrl } = body;

    if (!purchaseId || !receiptUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const purchase = await db.training_purchases.findUnique({
      where: { id: BigInt(purchaseId) }
    });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    if (purchase.buyer_user_id !== BigInt(currentUser.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update access status to pending_review
    await db.training_purchases.update({
      where: { id: BigInt(purchaseId) },
      data: {
        access_status: "pending_review"
      }
    });

// We can also update the linked payment record if needed
    if (purchase.payment_id) {
      await db.payments.update({
        where: { id: purchase.payment_id },
        data: { status: "under_review" } 
      });

      // Insert the receipt into payment_proofs so Finance Admin can see it
      await db.payment_proofs.create({
        data: {
          payment_id: purchase.payment_id,
          file_url: receiptUrl,
          uploaded_by: BigInt(currentUser.id)
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST Training Receipt Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
