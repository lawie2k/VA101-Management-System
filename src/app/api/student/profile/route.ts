import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "../../../../lib/auth";

// Helper to serialize BigInt fields to strings before JSON output
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
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
    const currentUser = await requireRole("student");
    const userId = currentUser.id;

    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) },
      include: {
        student_profiles: true
      }
    });

    if (!user || !user.student_profiles) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Parse combined avatar/cover image JSON inside profile_photo_url field
    let avatarUrl = "";
    let coverImage = "";
    if (user.profile_photo_url) {
      if (user.profile_photo_url.startsWith("{")) {
        try {
          const parsed = JSON.parse(user.profile_photo_url);
          avatarUrl = parsed.avatar || "";
          coverImage = parsed.coverImage || "";
        } catch {
          avatarUrl = user.profile_photo_url;
        }
      } else {
        avatarUrl = user.profile_photo_url;
      }
    }

    const profileData = {
      id: user.student_profiles.id.toString(),
      userId: user.id.toString(),
      fullName: user.full_name,
      email: user.email,
      learningGoal: user.student_profiles.learning_goal || "",
      status: user.student_profiles.status || "active",
      avatarUrl,
      coverImage,
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Failed to fetch student profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await requireRole("student");
    const userId = currentUser.id;

    const body = await req.json();
    const { fullName, learningGoal, avatarUrl, coverImage } = body;

    const updated = await prisma.$transaction(async (tx) => {
      // Handle avatar and cover image JSON merging
      let newProfilePhotoUrl = undefined;
      if (avatarUrl !== undefined || coverImage !== undefined) {
        const currentUserData = await tx.users.findUnique({
          where: { id: BigInt(userId) },
          select: { profile_photo_url: true }
        });
        let existingAvatar = "";
        let existingCover = "";
        if (currentUserData?.profile_photo_url?.startsWith("{")) {
          try {
            const parsed = JSON.parse(currentUserData.profile_photo_url);
            existingAvatar = parsed.avatar || "";
            existingCover = parsed.coverImage || "";
          } catch (e) {
            existingAvatar = currentUserData.profile_photo_url;
          }
        } else if (currentUserData?.profile_photo_url) {
          existingAvatar = currentUserData.profile_photo_url;
        }

        newProfilePhotoUrl = JSON.stringify({
          avatar: avatarUrl !== undefined ? avatarUrl : existingAvatar,
          coverImage: coverImage !== undefined ? coverImage : existingCover
        });
      }

      // Update User if basic info is provided
      if (fullName !== undefined || newProfilePhotoUrl !== undefined) {
        await tx.users.update({
          where: { id: BigInt(userId) },
          data: {
            ...(fullName !== undefined && { full_name: fullName }),
            ...(newProfilePhotoUrl !== undefined && { profile_photo_url: newProfilePhotoUrl }),
          }
        });
      }

      // Update Student Profile
      const profile = await tx.student_profiles.upsert({
        where: { user_id: BigInt(userId) },
        update: {
          ...(learningGoal !== undefined && { learning_goal: learningGoal }),
        },
        create: {
          user_id: BigInt(userId),
          learning_goal: learningGoal || "",
          status: "active",
        }
      });

      return profile;
    });

    return NextResponse.json({ success: true, profile: serializeBigInt(updated) });
  } catch (error) {
    console.error("Failed to update student profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return PATCH(req);
}
