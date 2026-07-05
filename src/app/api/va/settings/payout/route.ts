import { NextResponse } from "next/server";
import { db as prisma } from "../../../../../lib/db";
import { requireRole } from "../../../../../lib/auth";

function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
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
    const currentUser = await requireRole("va");
    
    const payout = await prisma.payout_methods.findFirst({
      where: { user_id: BigInt(currentUser.id), status: "active" }
    });

    return NextResponse.json({ success: true, data: serializeBigInt(payout) });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("va");
    const { method_type, account_name, masked_details } = await req.json();

    if (!method_type || !account_name || !masked_details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.payout_methods.findFirst({
      where: { user_id: BigInt(currentUser.id), status: "active" }
    });

    if (existing) {
      await prisma.payout_methods.update({
        where: { id: existing.id },
        data: { method_type, account_name, masked_details }
      });
    } else {
      await prisma.payout_methods.create({
        data: {
          user_id: BigInt(currentUser.id),
          method_type,
          account_name,
          masked_details,
          status: "active"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
