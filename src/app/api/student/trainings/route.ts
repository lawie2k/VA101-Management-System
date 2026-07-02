import { NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/db";
import { requireRole } from "../../../../lib/auth";

export async function GET(req: Request) {
  try {
    // Require student authentication
    await requireRole("student");

    // Fetch all active training materials
    const trainings = await prisma.training_materials.findMany({
      where: {
        status: "active"
      },
      include: {
        trainer_profiles: {
          include: {
            users: {
              select: {
                full_name: true,
                profile_photo_url: true,
              }
            }
          }
        },
        training_categories: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Format the response for the frontend
    const formattedTrainings = trainings.map(t => {
      // Handle json parsing for avatar if needed, similar to profile logic
      let trainerAvatar = null;
      if (t.trainer_profiles?.users?.profile_photo_url) {
        try {
          const parsed = JSON.parse(t.trainer_profiles.users.profile_photo_url);
          trainerAvatar = parsed.avatar || null;
        } catch {
          trainerAvatar = t.trainer_profiles.users.profile_photo_url;
        }
      }

      return {
        id: t.id.toString(),
        title: t.title,
        description: t.description || "",
        thumbnailUrl: t.thumbnail_url || null,
        price: t.price ? Number(t.price) : 0,
        currency: t.currency || "USD",
        category: t.training_categories?.name || "General",
        instructor: {
          name: t.trainer_profiles?.users?.full_name || "Instructor",
          avatarUrl: trainerAvatar
        }
      };
    });

    return NextResponse.json({ success: true, data: formattedTrainings });
  } catch (error) {
    console.error("Failed to fetch student trainings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
