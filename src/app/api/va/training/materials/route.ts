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

    // Fetch all active/published training materials
    const courses = await db.training_materials.findMany({
      where: {
        status: "active"
      },
      include: {
        training_categories: true
      }
    });

    const payload = courses.map((c: any) => ({
      id: c.id.toString(),
      title: c.title,
      description: c.description || "",
      price: c.price ? parseFloat(c.price.toString()) : 0,
      thumbnail: c.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      category: c.training_categories?.name || "General Training"
    }));

    return NextResponse.json(serializeBigInt(payload));
  } catch (error: any) {
    console.error("GET Training Materials Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
