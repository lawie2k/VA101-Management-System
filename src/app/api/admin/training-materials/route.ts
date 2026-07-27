import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

// Needed to properly serialize BigInts
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  try {
    await requireRole("admin");
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const materials = await prisma.training_materials.findMany({
      where: search ? {
        OR: [
          { title: { contains: search } },
          { trainer_profiles: { users: { full_name: { contains: search } } } }
        ]
      } : {},
      orderBy: { created_at: "desc" },
      include: {
        trainer_profiles: {
          include: { users: true }
        },
        training_categories: true
      }
    });

    const formattedMaterials = materials.map((mat) => {
      const categoryName = mat.training_categories?.name || "Uncategorized";
      const priceStr = mat.price ? `$${Number(mat.price)}` : "Free";
      
      let displayStatus = "Draft";
      if (mat.status === "pending_review") displayStatus = "Pending Review";
      else if (mat.status === "approved") displayStatus = "Approved";
      else if (mat.status === "revision_requested") displayStatus = "Revision Requested";
      else if (mat.status === "rejected") displayStatus = "Rejected";

      return {
        id: `CRS-${mat.id}`,
        rawId: mat.id.toString(),
        instructor: mat.trainer_profiles?.users?.full_name || "Unknown Instructor",
        title: mat.title,
        meta: `${categoryName} · ${priceStr}`,
        description: mat.description || "No description provided.",
        status: displayStatus,
        rawStatus: mat.status
      };
    });

    return NextResponse.json({ materials: formattedMaterials });

  } catch (error) {
    console.error("Failed to fetch training materials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole("admin");
    const { materialId, status } = await req.json();

    if (!materialId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.training_materials.update({
      where: { id: BigInt(materialId) },
      data: { status }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Failed to update training material:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
