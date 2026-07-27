import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

// Ensure BigInt serialization works for JSON responses
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  try {
    // Only admins can view all job posts
    await requireRole("admin");

    const jobPosts = await prisma.job_posts.findMany({
      where: {
        status: {
          in: ["approved", "active", "disabled"]
        }
      },
      include: {
        client_profiles: {
          select: {
            company_name: true,
            users: {
              select: {
                full_name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ jobPosts });
  } catch (error) {
    console.error("Error fetching admin job posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Only admins can change status of any job post
    await requireRole("admin");

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updated = await prisma.job_posts.update({
      where: { id: BigInt(id) },
      data: { status },
    });

    return NextResponse.json({ success: true, jobPost: updated });
  } catch (error) {
    console.error("Error updating job post status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
