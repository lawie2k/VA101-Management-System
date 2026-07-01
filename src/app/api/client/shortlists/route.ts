import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "../../../../lib/auth";

export async function GET(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    // Find the client profile for this user
    const clientProfile = await prisma.client_profiles.findUnique({
      where: { user_id: BigInt(userId) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    // Fetch shortlists for job posts belonging to this client
    const rawShortlists = await prisma.shortlists.findMany({
      where: {
        client_profile_id: clientProfile.id
      },
      include: {
        job_applications: {
          include: {
            va_profiles: {
              include: {
                users: {
                  select: { full_name: true }
                },
                va_skills: {
                  include: { skills: true }
                }
              }
            },
            job_posts: {
              select: { role_needed: true, job_title: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Serialize BigInts and format response
    const formatted = rawShortlists.map(s => {
      const vaProfile = s.job_applications?.va_profiles;
      const jobPost = s.job_applications?.job_posts;
      return {
        id: s.id.toString(),
        candidateName: vaProfile?.users?.full_name || "Unknown Candidate",
        role: jobPost?.role_needed || jobPost?.job_title,
        experience: vaProfile?.experience_level ? `${vaProfile.experience_level}` : "N/A",
        status: s.status,
        appliedDate: s.created_at ? s.created_at.toISOString().split('T')[0] : "N/A",
        skills: vaProfile?.va_skills.map(skillLink => skillLink.skills.name).slice(0, 3) || []
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch shortlists:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
