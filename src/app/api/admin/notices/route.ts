import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  try {
    await requireRole("admin");

    const notices = await prisma.notices.findMany({
      orderBy: { created_at: "desc" },
      include: {
        users: {
          select: {
            full_name: true,
          }
        }
      }
    });

    return NextResponse.json({ notices });
  } catch (error) {
    console.error("Error fetching admin notices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRole("admin");

    const body = await req.json();
    const { title, message, audience_type, priority } = body;

    if (!title || !message || !audience_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newNotice = await prisma.notices.create({
      data: {
        title,
        message,
        audience_type,
        priority: priority || "normal",
        created_by: BigInt(user.id),
      },
    });

    return NextResponse.json({ success: true, notice: newNotice });
  } catch (error) {
    console.error("Error creating admin notice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
