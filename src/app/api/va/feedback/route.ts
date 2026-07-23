import { NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/db";
import { requireRole } from "../../../../lib/auth";

function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    if (obj instanceof Date) return obj.toISOString();
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = serializeBigInt(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export async function GET(req: Request) {
  try {
    const currentUser = await requireRole("va");
    
    const vaProfile = await prisma.va_profiles.findUnique({
      where: { user_id: BigInt(currentUser.id) }
    });

    if (!vaProfile) {
      return NextResponse.json({ error: "VA Profile not found" }, { status: 404 });
    }

    const feedbacks = await prisma.va_feedback.findMany({
      where: { va_profile_id: vaProfile.id },
      include: {
        users: {
          select: {
            full_name: true,
            email: true,
            profile_photo_url: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const averageRating = feedbacks.length > 0 
      ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length 
      : 0;

    return NextResponse.json({ 
      success: true, 
      data: serializeBigInt({
        feedbacks,
        averageRating,
        totalReviews: feedbacks.length
      }) 
    });
  } catch (err) {
    console.error("Failed to fetch VA feedback:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
