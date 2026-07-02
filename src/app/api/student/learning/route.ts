import { NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/db";
import { requireRole } from "../../../../lib/auth";

export async function GET(req: Request) {
  try {
    // Require student authentication
    const currentUser = await requireRole("student");
    const userId = currentUser.id;

    // Fetch all active learning_access records for this user
    const enrolled = await prisma.learning_access.findMany({
      where: {
        user_id: BigInt(userId),
        access_status: "active"
      },
      include: {
        training_materials: {
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
          }
        }
      },
      orderBy: {
        granted_at: 'desc'
      }
    });

    // Format the response for the frontend
    const formattedEnrolled = enrolled.map(e => {
      const t = e.training_materials;
      
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
        category: t.training_categories?.name || "General",
        progress: 0, // In the future, this can be tracked via a separate table
        instructor: {
          name: t.trainer_profiles?.users?.full_name || "Instructor",
          avatarUrl: trainerAvatar
        }
      };
    });

    return NextResponse.json({ success: true, data: formattedEnrolled });
  } catch (error) {
    console.error("Failed to fetch student learning access:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
