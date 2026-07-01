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
      },
      include: {
        training_materials: {
          include: {
            training_categories: true
          }
        }
      }
    });

    const payload = enrolled.map((item: any) => ({
      id: item.training_materials.id.toString(),
      title: item.training_materials.title,
      description: item.training_materials.description || "",
      thumbnail: item.training_materials.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      category: item.training_materials.training_categories?.name || "General Training",
      progress: 0,
      status: "active"
    }));

    return NextResponse.json(serializeBigInt(payload));
  } catch (error: any) {
    console.error("GET My Learning Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
