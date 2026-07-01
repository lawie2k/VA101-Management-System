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

export async function GET() {
  try {
    const currentUser = await requireRole("va");

    const enrolled = await db.learning_access.findMany({
      where: {
        user_id: BigInt(currentUser.id),
        access_status: "active"
      }
    });

    const payload = enrolled.map((item) => ({
      courseId: item.training_material_id.toString()
    }));

    return NextResponse.json(serializeBigInt(payload));
  } catch (error: any) {
    console.error("GET Training Purchases Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("va");
    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // Check duplicate
    const existing = await db.learning_access.findFirst({
      where: {
        user_id: BigInt(currentUser.id),
        training_material_id: BigInt(courseId)
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Already enrolled in this course." }, { status: 400 });
    }

    const access = await db.learning_access.create({
      data: {
        user_id: BigInt(currentUser.id),
        training_material_id: BigInt(courseId),
        access_status: "active"
      }
    });

    return NextResponse.json({ success: true, courseId: access.training_material_id.toString() });
  } catch (error: any) {
    console.error("POST Training Purchase/Enroll Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
