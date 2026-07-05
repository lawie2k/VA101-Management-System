import { NextResponse } from "next/server";
import { db } from "../../../../../../lib/db";
import { requireRole } from "../../../../../../lib/auth";

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

export async function GET() {
  try {
    const currentUser = await requireRole("va");

    const pending = await db.training_purchases.findMany({
      where: {
        buyer_user_id: BigInt(currentUser.id),
        access_status: "locked"
      },
      include: {
        training_materials: {
          include: {
            trainer_profiles: {
              include: {
                users: true
              }
            }
          }
        }
      }
    });

    const payload = pending.map((item) => ({
      purchaseId: item.id.toString(),
      courseId: item.training_material_id.toString(),
      amount: item.amount_paid ? parseFloat(item.amount_paid.toString()) : 0,
      title: item.training_materials?.title || "Unknown Course",
      instructor: item.training_materials?.trainer_profiles?.users?.full_name || "Unknown Instructor",
      date: item.purchased_at?.toISOString() || new Date().toISOString()
    }));

    return NextResponse.json(serializeBigInt(payload));
  } catch (error: any) {
    console.error("GET Pending Purchases Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
