import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { requireRole } from "../../../../../lib/auth";

function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === "object" && obj[key].constructor && obj[key].constructor.name === "Decimal") {
        newObj[key] = parseFloat(obj[key].toString());
      } else {
        newObj[key] = serializeBigInt(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("va");
    const body = await req.json();
    const { courseId, gateway } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // Check duplicate
    const existing = await db.training_purchases.findFirst({
      where: {
        buyer_user_id: BigInt(currentUser.id),
        training_material_id: BigInt(courseId)
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Purchase or enrollment already exists for this course." }, { status: 400 });
    }

    const course = await db.training_materials.findUnique({
      where: { id: BigInt(courseId) }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const price = course.price ? parseFloat(course.price.toString()) : 0;

    if (price <= 0) {
      return NextResponse.json({ error: "Use enrollment API for free courses." }, { status: 400 });
    }

    // Create payment
    const payment = await db.payments.create({
      data: {
        payer_user_id: BigInt(currentUser.id),
        payment_type: "training_purchase",
        related_training_material_id: BigInt(courseId),
        amount_paid: price,
        status: "pending",
        payment_method: gateway || "Wise",
        remarks: "Payment for Training Course"
      }
    });

    // Create locked training purchase
    const purchase = await db.training_purchases.create({
      data: {
        training_material_id: BigInt(courseId),
        buyer_user_id: BigInt(currentUser.id),
        payment_id: payment.id,
        amount_paid: price,
        access_status: "locked"
      }
    });

    return NextResponse.json({ success: true, purchaseId: serializeBigInt(purchase.id) });
  } catch (error: any) {
    console.error("POST Training Buy Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    const currentUser = await requireRole("va");
    const { searchParams } = new URL(req.url);
    const purchaseId = searchParams.get("purchaseId");

    if (!purchaseId) {
      return NextResponse.json({ error: "Purchase ID is required" }, { status: 400 });
    }

    const purchase = await db.training_purchases.findUnique({
      where: { id: BigInt(purchaseId) }
    });

    if (!purchase || purchase.buyer_user_id !== BigInt(currentUser.id)) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    if (purchase.access_status !== "locked") {
      return NextResponse.json({ error: "Cannot cancel a purchase that is already under review or unlocked." }, { status: 400 });
    }

    // Delete purchase
    await db.training_purchases.delete({
      where: { id: purchase.id }
    });

    // Delete associated payment if exists
    if (purchase.payment_id) {
      await db.payments.delete({
        where: { id: purchase.payment_id }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Training Buy Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
