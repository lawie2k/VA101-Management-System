import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

// Helper to serialize BigInt fields to strings before JSON output
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === "object" && obj[key].constructor && obj[key].constructor.name === "Decimal") {
        newObj[key] = parseFloat(obj[key].toString());
      } else {
        newObj[key] = serializeBigInt(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ vaProfileId: string }> }
) {
  try {
    await requireRole("client");
    
    const { vaProfileId } = await params;

    if (!vaProfileId) {
      return NextResponse.json({ error: "Missing vaProfileId" }, { status: 400 });
    }

    const profileId = BigInt(vaProfileId);

    // Fetch profile and join nested tables
    const profile = await db.va_profiles.findUnique({
      where: { id: profileId },
      include: {
        users: true,
        va_skills: { include: { skills: true } },
        va_tools: { include: { tools: true } },
        va_portfolios: true,
        niches: true
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "VA Profile not found" }, { status: 404 });
    }

    // Parse combined avatar/cover image JSON inside profile_photo_url field
    let avatar = "";
    let coverImage = "";
    if (profile.users?.profile_photo_url) {
      if (profile.users.profile_photo_url.startsWith("{")) {
        try {
          const parsed = JSON.parse(profile.users.profile_photo_url);
          avatar = parsed.avatar || "";
          coverImage = parsed.coverImage || "";
        } catch {
          avatar = profile.users.profile_photo_url;
        }
      } else {
        avatar = profile.users.profile_photo_url;
      }
    }

    const responsePayload = {
      id: profile.id,
      fullName: profile.users?.full_name || "Unknown",
      email: profile.users?.email || "",
      avatar,
      coverImage,
      title: profile.headline || "",
      experienceYears: profile.experience_level ? parseInt(profile.experience_level) || 0 : 0,
      location: profile.location || "",
      expectedRate: profile.expected_hourly_rate ? parseFloat(profile.expected_hourly_rate.toString()) : 0,
      openToOpportunities: profile.profile_visibility === "public",
      about: profile.bio || "",
      niche: profile.niches?.name || "",
      skills: profile.va_skills.map((vs: any) => vs.skills.name),
      tools: profile.va_tools.map((vt: any) => vt.tools.name),
      portfolio: profile.va_portfolios.map((vp: any) => ({
        id: vp.id.toString(),
        icon: vp.external_link || "📎",
        title: vp.title,
        sub: vp.description || ""
      })),
      availability: {
        hours: profile.availability_summary || "",
        schedule: profile.work_shift ? profile.work_shift.split(" | ")[0] : "",
        timezone: profile.work_shift && profile.work_shift.includes(" | ") ? profile.work_shift.split(" | ")[1] : ""
      },
      experience: [], // Not yet modeled fully in DB, leaving empty for now
      certifications: [] // Not yet modeled fully in DB, leaving empty for now
    };

    return NextResponse.json(serializeBigInt(responsePayload));
  } catch (error: any) {
    console.error("GET Candidate Profile Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
