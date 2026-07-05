import { NextResponse } from "next/server";
import { db as prisma } from "../../../../../lib/db";
import { requireRole } from "../../../../../lib/auth";

function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    if (obj instanceof Date) return obj.toISOString();
    // Also handle Prisma Decimal (which is an object with a toString method)
    if (obj.d && obj.e !== undefined && obj.s !== undefined) return obj.toString();
    if (obj.constructor && obj.constructor.name === "Decimal") return obj.toString();

    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = serializeBigInt(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export async function GET(req: Request) {
  try {
    const currentUser = await requireRole("trainer");
    
    // Fetch payouts specifically for this user
    const history = await prisma.payouts.findMany({
      where: { recipient_user_id: BigInt(currentUser.id) },
      orderBy: { created_at: 'desc' },
      include: {
        payout_methods: true
      }
    });

    return NextResponse.json({ success: true, data: serializeBigInt(history) });
  } catch (err) {
    console.error("Failed to fetch payout history:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
