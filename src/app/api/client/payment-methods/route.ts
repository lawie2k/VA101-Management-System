import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const methods = await prisma.payout_methods.findMany({
      where: { user_id: BigInt(userId) },
      orderBy: { created_at: 'desc' }
    });

    const formattedMethods = methods.map(m => ({
      id: m.id.toString(),
      methodType: m.method_type,
      accountName: m.account_name,
      accountDetails: m.masked_details,
      status: m.status
    }));

    return NextResponse.json({ paymentMethods: formattedMethods });
  } catch (error) {
    console.error("Failed to fetch payment methods:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const body = await req.json();
    const { methodType, accountName, accountDetails } = body;

    if (!methodType || !accountName || !accountDetails) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMethod = await prisma.payout_methods.create({
      data: {
        user_id: BigInt(userId),
        method_type: methodType,
        account_name: accountName,
        masked_details: accountDetails,
        status: "active"
      }
    });

    return NextResponse.json({ 
      success: true, 
      paymentMethod: {
        id: newMethod.id.toString(),
        methodType: newMethod.method_type,
        accountName: newMethod.account_name,
        accountDetails: newMethod.masked_details,
        status: newMethod.status
      } 
    });
  } catch (error) {
    console.error("Failed to create payment method:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Verify ownership before deleting
    const existing = await prisma.payout_methods.findUnique({
      where: { id: BigInt(id) }
    });

    if (!existing || existing.user_id !== BigInt(userId)) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.payout_methods.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete payment method:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
