import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const { action } = body; // "pause" or "delete"

    if (action === "pause") {
      await prisma.users.update({
        where: { id: BigInt(user.id) },
        data: {
          account_status: "paused",
          updated_at: new Date()
        }
      });
      return NextResponse.json({ success: true, message: "Account paused successfully" });
    } 
    
    if (action === "delete") {
      await prisma.users.update({
        where: { id: BigInt(user.id) },
        data: {
          account_status: "deleted",
          updated_at: new Date()
        }
      });
      return NextResponse.json({ success: true, message: "Account deleted successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Error processing danger zone action:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.status || 500 }
    );
  }
}
