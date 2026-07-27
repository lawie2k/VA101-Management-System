import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { db } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const freshUser = await db.users.findUnique({
      where: { id: BigInt(session.user.id) }
    });

    if (!freshUser) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const responseUser = {
      id: freshUser.id.toString(),
      email: freshUser.email,
      fullName: freshUser.full_name,
      profilePhotoUrl: freshUser.profile_photo_url,
      roles: session.user.roles,
    };

    // If client, fetch the client profile to check for signed contract
    let hasSignedContract = false;
    if (session.user.roles.includes("client")) {
      const clientProfile = await db.client_profiles.findUnique({
        where: { user_id: BigInt(session.user.id) }
      });
      if (clientProfile) {
        hasSignedContract = clientProfile.has_signed_contract;
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        ...responseUser,
        hasSignedContract
      }
    });
  } catch (err) {
    console.error("Session fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error fetching session." },
      { status: 500 }
    );
  }
}
