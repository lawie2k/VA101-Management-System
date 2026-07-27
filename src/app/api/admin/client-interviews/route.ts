import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  try {
    await requireRole("admin");

    const interviews = await prisma.interviews.findMany({
      where: {
        interview_type: "client"
      },
      // Since it's client interviews, we probably want to get the job application 
      // and the VA's name, as well as the client who scheduled it.
      // But based on the schema, `job_application_id` links to `job_applications`
      // which links to `users` (the VA) and `job_posts` (the client).
      // We'll fetch what we need:
      /* include: {
        // If we had the relationships defined in Prisma, we'd do this:
        // job_applications: { include: { users: true, job_posts: { include: { client_profiles: true } } } }
      }, */
      orderBy: { created_at: "desc" },
    });

    // In a real scenario, we might join the data if the foreign keys are set up.
    // Assuming we have basic fields in `interviews`:
    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Error fetching admin client interviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole("admin");

    const body = await req.json();
    const { id, status, result, meeting_link, remarks } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing interview id" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (result !== undefined) dataToUpdate.result = result;
    if (meeting_link !== undefined) dataToUpdate.meeting_link = meeting_link;
    if (remarks !== undefined) dataToUpdate.remarks = remarks;
    if (status === "completed") dataToUpdate.completed_at = new Date();

    const updated = await prisma.interviews.update({
      where: { id: BigInt(id) },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, interview: updated });
  } catch (error) {
    console.error("Error updating client interview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
