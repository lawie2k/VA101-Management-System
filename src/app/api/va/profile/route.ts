import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { requireRole } from "../../../../lib/auth";

// Helper to serialize BigInt fields to strings before JSON output
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      // Handle Prisma Decimal conversions if present
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

export async function GET() {
  try {
    const currentUser = await requireRole("va");
    
    // Fetch profile and join nested tables
    let profile = await db.va_profiles.findUnique({
      where: { user_id: BigInt(currentUser.id) },
      include: {
        users: true,
        va_skills: { include: { skills: true } },
        va_tools: { include: { tools: true } },
        va_portfolios: true,
        niches: true
      }
    });

    // Auto-create default profile for new user registrations
    if (!profile) {
      profile = await db.va_profiles.create({
        data: {
          user_id: BigInt(currentUser.id),
          headline: "",
          location: "",
          expected_hourly_rate: 0,
          availability_summary: "",
          bio: ""
        },
        include: {
          users: true,
          va_skills: { include: { skills: true } },
          va_tools: { include: { tools: true } },
          va_portfolios: true,
          niches: true
        }
      });
    }

    // Parse combined avatar/cover image JSON inside profile_photo_url field
    let avatar = "";
    let coverImage = "";
    if (profile.users.profile_photo_url) {
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
      fullName: profile.users.full_name,
      email: profile.users.email,
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
        schedule: profile.work_shift || "",
        timezone: ""
      },
      experience: [],
      certifications: []
    };

    return NextResponse.json(serializeBigInt(responsePayload));
  } catch (error: any) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await requireRole("va");
    const body = await req.json();

    // 1. Fetch current profile
    let profile = await db.va_profiles.findUnique({
      where: { user_id: BigInt(currentUser.id) }
    });

    if (!profile) {
      profile = await db.va_profiles.create({
        data: {
          user_id: BigInt(currentUser.id)
        }
      });
    }

    // 2. Prepare avatar/cover image payload
    const currentPhotoUrl = (await db.users.findUnique({
      where: { id: BigInt(currentUser.id) }
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

    const photoPayload = JSON.stringify({
      avatar: body.avatar !== undefined ? body.avatar : existingAvatar,
      coverImage: body.coverImage !== undefined ? body.coverImage : existingCover
    });

    // 3. Update User metadata
    await db.users.update({
      where: { id: BigInt(currentUser.id) },
      data: {
        full_name: body.fullName || undefined,
        profile_photo_url: photoPayload
      }
    });

    // Look up preferred_niche_id
    let preferredNicheId: bigint | null | undefined = undefined;
    if (body.niche !== undefined) {
      if (body.niche) {
        let niche = await db.niches.findUnique({ where: { name: body.niche } });
        if (!niche) {
          niche = await db.niches.create({ data: { name: body.niche } });
        }
        preferredNicheId = niche.id;
      } else {
        preferredNicheId = null;
      }
    }

    // 4. Update VA Profile fields
    const updatedProfile = await db.va_profiles.update({
      where: { id: profile.id },
      data: {
        headline: body.title !== undefined ? body.title : undefined,
        bio: body.about !== undefined ? body.about : undefined,
        location: body.location !== undefined ? body.location : undefined,
        experience_level: body.experienceYears !== undefined ? body.experienceYears.toString() : undefined,
        expected_hourly_rate: body.expectedRate !== undefined ? body.expectedRate : undefined,
        profile_visibility: body.openToOpportunities !== undefined ? (body.openToOpportunities ? "public" : "private") : undefined,
        preferred_niche_id: preferredNicheId,
        availability_summary: body.availability?.hours !== undefined ? body.availability.hours : undefined,
        work_shift: body.availability?.schedule !== undefined ? body.availability.schedule : undefined
      }
    });

    // 5. Update Skills (delete and recreate join entries)
    if (body.skills && Array.isArray(body.skills)) {
      await db.va_skills.deleteMany({ where: { va_profile_id: profile.id } });
      for (const skillName of body.skills) {
        let skill = await db.skills.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await db.skills.create({ data: { name: skillName, category: "General" } });
        }
        await db.va_skills.create({
          data: {
            va_profile_id: profile.id,
            skill_id: skill.id,
            proficiency_level: "Intermediate"
          }
        });
      }
    }

    // 6. Update Tools (delete and recreate join entries)
    if (body.tools && Array.isArray(body.tools)) {
      await db.va_tools.deleteMany({ where: { va_profile_id: profile.id } });
      for (const toolName of body.tools) {
        let tool = await db.tools.findUnique({ where: { name: toolName } });
        if (!tool) {
          tool = await db.tools.create({ data: { name: toolName, category: "General" } });
        }
        await db.va_tools.create({
          data: {
            va_profile_id: profile.id,
            tool_id: tool.id,
            proficiency_level: "Intermediate"
          }
        });
      }
    }

    // 7. Update Portfolios
    if (body.portfolio && Array.isArray(body.portfolio)) {
      await db.va_portfolios.deleteMany({ where: { va_profile_id: profile.id } });
      for (const port of body.portfolio) {
        await db.va_portfolios.create({
          data: {
            va_profile_id: profile.id,
            title: port.title,
            description: port.sub || "",
            external_link: port.icon || "📎"
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PATCH Profile Error:", error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
