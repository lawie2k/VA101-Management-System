import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";

import { requireRole } from "../../../../lib/auth";

export async function PUT(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const body = await req.json();
    const { companyName, industry, companySize, companyWebsite, companyDescription, fullName, email } = body;

    const updated = await prisma.$transaction(async (tx) => {
      // Update User if basic info is provided
      if (fullName || email) {
        await tx.users.update({
          where: { id: BigInt(userId) },
          data: {
            full_name: fullName !== undefined ? fullName : undefined,
            email: email !== undefined ? email : undefined,
          }
        });
      }

      // Update or Create Client Profile
      const profile = await tx.client_profiles.upsert({
        where: { user_id: BigInt(userId) },
        update: {
          company_name: companyName,
          industry: industry,
          company_size: companySize,
          company_website: companyWebsite,
          company_description: companyDescription,
        },
        create: {
          user_id: BigInt(userId),
          company_name: companyName || "",
          industry: industry || "",
          company_size: companySize || "1-10",
          company_website: companyWebsite || "",
          company_description: companyDescription || "",
        }
      });

      return profile;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
