import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "../../../../lib/auth";

export async function GET(req: Request) {
  try {
    const currentUser = await requireRole("trainer");
    const userId = currentUser.id;

    let trainerProfile = await prisma.trainer_profiles.findUnique({
      where: { user_id: BigInt(userId) },
      include: {
        users: {
          select: {
            full_name: true,
            email: true,
            profile_photo_url: true,
          }
        }
      }
    });

    if (!trainerProfile) {
      // Return a draft structure if profile doesn't exist yet
      return NextResponse.json({
        status: "draft",
        fullName: "",
        bio: "",
        expertise: "",
      });
    }

    // Parse combined avatar/cover image JSON inside profile_photo_url field
    let avatar = "";
    let coverImage = "";
    if (trainerProfile.users?.profile_photo_url) {
      const photoUrl = trainerProfile.users.profile_photo_url;
      if (photoUrl.startsWith("{")) {
        try {
          const parsed = JSON.parse(photoUrl);
          avatar = parsed.avatar || "";
          coverImage = parsed.coverImage || "";
        } catch {
          avatar = photoUrl;
        }
      } else {
        avatar = photoUrl;
      }
    }

    return NextResponse.json({
      id: trainerProfile.id.toString(),
      status: trainerProfile.status,
      fullName: trainerProfile.users?.full_name || "",
      email: trainerProfile.users?.email || "",
      avatar,
      coverImage,
      bio: trainerProfile.bio || "",
      expertise: trainerProfile.expertise || "",
    });

  } catch (error: any) {
    console.error("Trainer Profile GET Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await requireRole("trainer");
    const userId = currentUser.id;

    const body = await req.json();
    const { fullName, bio, expertise, avatar, coverImage } = body;

    // Fetch existing photo state
    const currentPhotoUrl = (await prisma.users.findUnique({
      where: { id: BigInt(userId) }
    }))?.profile_photo_url;

    let existingAvatar = "";
    let existingCover = "";
    if (currentPhotoUrl && currentPhotoUrl.startsWith("{")) {
      try {
        const parsed = JSON.parse(currentPhotoUrl);
        existingAvatar = parsed.avatar || "";
        existingCover = parsed.coverImage || "";
      } catch {}
    } else if (currentPhotoUrl) {
      existingAvatar = currentPhotoUrl;
    }

    // Merge photo payload
    const photoPayload = JSON.stringify({
      avatar: avatar !== undefined ? avatar : existingAvatar,
      coverImage: coverImage !== undefined ? coverImage : existingCover
    });

    // Update user's full name and/or photos
    if (fullName !== undefined || avatar !== undefined || coverImage !== undefined) {
      const updateData: any = {};
      if (fullName !== undefined) updateData.full_name = fullName;
      if (avatar !== undefined || coverImage !== undefined) updateData.profile_photo_url = photoPayload;

      await prisma.users.update({
        where: { id: BigInt(userId) },
        data: updateData
      });
    }

    // Upsert the trainer profile
    const profile = await prisma.trainer_profiles.upsert({
      where: { user_id: BigInt(userId) },
      update: {
        bio: bio,
        expertise: expertise,
        status: "active"
      },
      create: {
        user_id: BigInt(userId),
        bio: bio,
        expertise: expertise,
        status: "active"
      },
      include: {
        users: {
          select: {
            full_name: true,
            email: true,
            profile_photo_url: true,
          }
        }
      }
    });

    // Extract new avatar/cover from updated user object
    let updatedAvatar = "";
    let updatedCover = "";
    if (profile.users?.profile_photo_url) {
      const url = profile.users.profile_photo_url;
      if (url.startsWith("{")) {
        try {
          const parsed = JSON.parse(url);
          updatedAvatar = parsed.avatar || "";
          updatedCover = parsed.coverImage || "";
        } catch {
          updatedAvatar = url;
        }
      } else {
        updatedAvatar = url;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id.toString(),
        status: profile.status,
        fullName: profile.users?.full_name || "",
        email: profile.users?.email || "",
        avatar: updatedAvatar,
        coverImage: updatedCover,
        bio: profile.bio || "",
        expertise: profile.expertise || "",
      }
    });

  } catch (error: any) {
    console.error("Trainer Profile PATCH Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
