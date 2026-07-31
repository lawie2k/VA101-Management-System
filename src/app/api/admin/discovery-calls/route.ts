import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";
import { sendEmail } from "@/src/lib/email";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  try {
    await requireRole("admin", "employee");

    const discoveryCalls = await prisma.discovery_calls.findMany({
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

    return NextResponse.json({ discoveryCalls });
  } catch (error) {
    console.error("Error fetching admin discovery calls:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole("admin", "employee");

    const body = await req.json();
    const { id, status, meeting_link } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dataToUpdate: any = { status };
    if (meeting_link) {
      dataToUpdate.meeting_link = meeting_link;
    }

    const updated = await prisma.discovery_calls.update({
      where: { id: BigInt(id) },
      data: dataToUpdate,
      include: {
        client_profiles: {
          select: { users: { select: { email: true, full_name: true } } }
        }
      }
    });

    if (status === "confirmed" && meeting_link) {
      const email = updated.guest_email || updated.client_profiles?.users?.email;
      const name = updated.guest_name || updated.client_profiles?.users?.full_name || "Guest";
      const date = updated.requested_date;
      const time = updated.requested_time;

      if (email) {
        await sendEmail({
          toAddress: email,
          subject: "Your VA101 Discovery Call is Confirmed!",
          htmlBody: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #E84E29;">Discovery Call Confirmed</h2>
              <p>Hi ${name},</p>
              <p>Your discovery call has been confirmed. We're excited to speak with you!</p>
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${date}</p>
                <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${time}</p>
                <p style="margin: 0;"><strong>Meeting Link:</strong> <a href="${meeting_link}" style="color: #0ea5e9;">${meeting_link}</a></p>
              </div>
              <p>Please use the meeting link above to join the call at the scheduled time.</p>
              <p>Best regards,<br/>The VA101 Team</p>
            </div>
          `
        });
      }
    }

    return NextResponse.json({ success: true, call: updated });
  } catch (error) {
    console.error("Error updating discovery call status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
