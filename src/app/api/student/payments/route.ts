import { NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/db";
import { requireRole } from "../../../../lib/auth";

export async function GET(req: Request) {
  try {
    // Require student authentication
    const currentUser = await requireRole("student");
    const userId = currentUser.id;

    // Fetch all training purchases for this user
    const purchases = await prisma.training_purchases.findMany({
      where: {
        buyer_user_id: BigInt(userId)
      },
      include: {
        training_materials: true,
        payments: true
      },
      orderBy: {
        purchased_at: 'desc'
      }
    });

    // Format the response for the frontend
    const formattedPurchases = purchases.map(p => ({
      id: p.id.toString(),
      courseTitle: p.training_materials?.title || "Unknown Course",
      amountPaid: p.amount_paid ? Number(p.amount_paid) : 0,
      currency: p.payments?.currency || "USD",
      status: p.access_status || "completed", // fallback to completed if access_status is null
      date: p.purchased_at ? p.purchased_at.toISOString() : new Date().toISOString(),
      referenceNumber: p.payments?.reference_number || `REF-${p.id.toString().padStart(6, '0')}`,
      paymentMethod: p.payments?.payment_method || "Credit Card"
    }));

    return NextResponse.json({ success: true, data: formattedPurchases });
  } catch (error) {
    console.error("Failed to fetch student payment history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
