import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export const dynamic = "force-dynamic";

function serializeBigInt(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
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

    const materialId = BigInt(params.id);
    const existingMaterial = await db.training_materials.findUnique({
      where: { id: materialId }
    });

    if (!existingMaterial || existingMaterial.trainer_profile_id !== trainerProfile.id) {
      return NextResponse.json({ error: "Material not found or access denied" }, { status: 404 });
    }

    const body = await req.json();
    
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.thumbnail_url !== undefined) updateData.thumbnail_url = body.thumbnail_url;
    if (body.material_url !== undefined) updateData.material_url = body.material_url;

    if (body.category !== undefined) {
      let categoryRecord = await db.training_categories.findUnique({
        where: { name: body.category }
      });
      if (!categoryRecord) {
        categoryRecord = await db.training_categories.create({
          data: { name: body.category }
        });
      }
      updateData.category_id = categoryRecord.id;
    }

    const updatedMaterial = await db.training_materials.update({
      where: { id: materialId },
      data: updateData,
      include: {
        training_categories: true,
        training_purchases: true
      }
    });

    return NextResponse.json(serializeBigInt(updatedMaterial));
  } catch (err) {
    console.error("PATCH /api/trainer/materials/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
