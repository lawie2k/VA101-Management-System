import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  try {
    await requireRole("admin");

    const discoveryCalls = await prisma.discovery_calls.findMany({
      include: {
        client_profiles: {
          select: {
            company_name: true,
            users: {
              select: {
                full_name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ discoveryCalls });
  } catch (error) {
    console.error("Error fetching admin discovery calls:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole("admin");

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updated = await prisma.discovery_calls.update({
      where: { id: BigInt(id) },
      data: { status },
    });

    return NextResponse.json({ success: true, call: updated });
  } catch (error) {
    console.error("Error updating discovery call status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
