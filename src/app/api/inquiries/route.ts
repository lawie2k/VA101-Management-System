import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { rateLimit } from "../../../lib/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    
    // Limit to 5 requests per 15 minutes per IP
    const limitCheck = rateLimit(ip, 5, 15 * 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Map frontend properties to MySQL schema fields
    const inquiry = await db.client_inquiries.create({
      data: {
        client_name: body.fullName,
        company_name: body.company || null,
        email: body.workEmail,
        phone: body.phone || null,
        industry: body.industry || null,
        needed_role: body.roleType || null,
        required_skills: body.preferredTools || [],
        budget_package: body.monthlyBudget || null,
        schedule: {
          hoursPerWeek: body.hoursPerWeek || null,
          startDate: body.startDate || null,
          timezone: body.timezone || null,
          englishLevel: body.englishLevel || null,
          tasks: body.tasks || null,
          companySize: body.companySize || null,
          companyWebsite: body.companyWebsite || null,
        },
        status: "pending",
      },
    });

    // Convert BigInt id to String to avoid JSON serialization error in Next.js
    const serializedInquiry = {
      ...inquiry,
      id: inquiry.id.toString(),
    };

    return NextResponse.json({ success: true, inquiry: serializedInquiry }, { status: 201 });
  } catch (error: any) {
    console.error("Database inquiry save error:", error);
    return NextResponse.json(
      { success: false, error: "Database error: " + error.message },
      { status: 500 }
    );
  }
}
