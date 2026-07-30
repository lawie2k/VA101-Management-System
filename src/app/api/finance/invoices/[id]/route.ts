import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    if (!user.roles.some((r: string) => ["admin", "finance", "super_admin"].includes(r))) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { id: paramId } = await params;
    const id = BigInt(paramId);
    const body = await req.json();
    const { status } = body;

    const updated = await prisma.invoices.update({
      where: { id },
      data: {
        status: status || "paid",
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      invoice: {
        ...updated,
        id: updated.id.toString(),
        client_profile_id: updated.client_profile_id.toString(),
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
