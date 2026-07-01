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

    // Fetch contracts belonging to this client
    const rawContracts = await prisma.contracts.findMany({
      where: {
        client_profile_id: clientProfile.id
      },
      include: {
        va_profiles: {
          include: {
            users: { select: { full_name: true } }
          }
        },
        assignments: {
          include: {
            job_posts: {
              select: { 
                job_title: true, 
                role_needed: true,
                client_hourly_rate: true,
                work_schedule: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Serialize BigInts and format response
    const formatted = rawContracts.map(c => ({
      id: c.id.toString(),
      vaName: c.va_profiles.users?.full_name || "Unknown VA",
      role: c.assignments?.job_posts.role_needed || c.assignments?.job_posts.job_title || "Virtual Assistant",
      rate: c.assignments?.job_posts.client_hourly_rate ? `$${c.assignments.job_posts.client_hourly_rate}/hr` : "TBD",
      hours: c.assignments?.job_posts.work_schedule || "Full-time",
      startDate: c.assignments?.start_date ? c.assignments.start_date.toISOString().split('T')[0] : (c.created_at ? c.created_at.toISOString().split('T')[0] : "TBD"),
      status: c.status || "draft",
      fileUrl: c.file_url,
      signedFileUrl: c.signed_file_url
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch contracts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
