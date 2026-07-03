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

    return NextResponse.json({
      id: trainerProfile.id.toString(),
      status: trainerProfile.status,
      fullName: trainerProfile.users?.full_name || "",
      email: trainerProfile.users?.email || "",
      avatar: trainerProfile.users?.profile_photo_url || "",
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
    const { fullName, bio, expertise } = body;

    // Update user's full name
    if (fullName) {
      await prisma.users.update({
        where: { id: BigInt(userId) },
        data: { full_name: fullName }
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

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id.toString(),
        status: profile.status,
        fullName: profile.users?.full_name || "",
        email: profile.users?.email || "",
        avatar: profile.users?.profile_photo_url || "",
        bio: profile.bio || "",
        expertise: profile.expertise || "",
      }
    });

  } catch (error: any) {
    console.error("Trainer Profile PATCH Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
