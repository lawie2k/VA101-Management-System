import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export const dynamic = "force-dynamic";

// Utility to serialize BigInt
function serializeBigInt(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trainerProfile = await db.trainer_profiles.findUnique({
      where: { user_id: BigInt(session.user.id) }
    });

    if (!trainerProfile) {
      return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
    }

    const materials = await db.training_materials.findMany({
      where: { 
        trainer_profile_id: trainerProfile.id,
        status: { not: "deleted" }
      },
      include: {
        training_categories: true,
        training_purchases: true // To calculate sales/earnings
      },
      orderBy: { created_at: "desc" }
    });

    const formattedMaterials = materials.map((m: any) => {
      // Calculate sales and earnings from purchases
      const salesCount = m.training_purchases?.length || 0;
      // Trainer keeps (100 - platform_commission_rate)% 
      const commissionRate = m.platform_commission_rate ? parseFloat(m.platform_commission_rate.toString()) : 30;
      const trainerPercentage = (100 - commissionRate) / 100;
      
      let totalEarnings = 0;
      if (m.training_purchases) {
        totalEarnings = m.training_purchases.reduce((sum: number, purchase: any) => {
          return sum + (parseFloat(purchase.amount_paid) * trainerPercentage);
        }, 0);
      }

      return {
        id: Number(m.id),
        title: m.title,
        category: m.training_categories?.name || "Uncategorized",
        status: m.status,
        thumbnail: m.thumbnail_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=400&q=80",
        material_url: m.material_url || "",
        price: parseFloat(m.price?.toString() || "0"),
        description: m.description || "",
        sales: salesCount,
        trainerPayout: Number(totalEarnings.toFixed(2))
      };
    });

    return NextResponse.json({ materials: formattedMaterials });
  } catch (err) {
    console.error("GET /api/trainer/materials error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trainerProfile = await db.trainer_profiles.findUnique({
      where: { user_id: BigInt(session.user.id) }
    });

    if (!trainerProfile) {
      return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, category, price, description, status, thumbnail_url, material_url } = body;

    if (!title || !category || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find or create category
    let categoryRecord = await db.training_categories.findUnique({
      where: { name: category }
    });

    if (!categoryRecord) {
      categoryRecord = await db.training_categories.create({
        data: { name: category }
      });
    }

    const newMaterial = await db.training_materials.create({
      data: {
        trainer_profile_id: trainerProfile.id,
        category_id: categoryRecord.id,
        title,
        description,
        price: price,
        thumbnail_url: thumbnail_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=400&q=80",
        material_url: material_url || "",
        status: status || "draft",
        platform_commission_rate: 30.00
      }
    });

    return NextResponse.json(serializeBigInt(newMaterial));
  } catch (err) {
    console.error("POST /api/trainer/materials error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
