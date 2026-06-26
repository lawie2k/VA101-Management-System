import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { rateLimit } from "../../../lib/rateLimit";
import crypto from "crypto";
import path from "path";
import { promises as fs } from "fs";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function validateFile(buffer: Buffer, filename: string, mimeType: string): { valid: boolean; error?: string } {
  const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
  const fileExt = path.extname(filename).toLowerCase();
  
  if (!allowedExtensions.includes(fileExt)) {
    return { valid: false, error: `Invalid file extension: ${fileExt}. Only PDF, PNG, and JPG/JPEG are allowed.` };
  }

  // Whitelist MIME types
  const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/pjpeg"];
  if (!allowedMimeTypes.includes(mimeType)) {
    return { valid: false, error: `Invalid file content type: ${mimeType}.` };
  }

  // Magic Numbers (Signatures) check to prevent script masquerading
  if (fileExt === ".pdf") {
    if (buffer.length < 4 || buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
      return { valid: false, error: "Forged PDF file detected (file header is invalid)." };
    }
  } else if (fileExt === ".png") {
    if (
      buffer.length < 8 ||
      buffer[0] !== 0x89 ||
      buffer[1] !== 0x50 ||
      buffer[2] !== 0x4E ||
      buffer[3] !== 0x47 ||
      buffer[4] !== 0x0D ||
      buffer[5] !== 0x0A ||
      buffer[6] !== 0x1A ||
      buffer[7] !== 0x0A
    ) {
      return { valid: false, error: "Forged PNG image detected (file header is invalid)." };
    }
  } else if (fileExt === ".jpg" || fileExt === ".jpeg") {
    if (buffer.length < 3 || buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
      return { valid: false, error: "Forged JPEG image detected (file header is invalid)." };
    }
  }

  return { valid: true };
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check (Defaults to 5 requests per 15 minutes per IP)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const limitCheck = rateLimit(ip, 5, 15 * 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again after 15 minutes." },
        { status: 429 }
      );
    }

    const data = await request.formData();

    // Step 1 Details
    const fullName = (data.get("fullName") as string || "").trim();
    const email = (data.get("email") as string || "").trim().toLowerCase();
    const password = data.get("password") as string;
    const phone = (data.get("phone") as string || "").trim();

    // Input Validation
    if (!fullName || !email || !password || !phone) {
      return NextResponse.json({ success: false, error: "Required fields in Step 1 are missing." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address format." }, { status: 400 });
    }

    // Step 2 Details
    const nicheName = data.get("niche") as string;
    const experience = data.get("experience") as string;
    const expectedRate = data.get("expectedRate") as string;
    const toolsJson = data.get("tools") as string;
    const tools = JSON.parse(toolsJson || "[]") as string[];

    if (!nicheName || !experience || !expectedRate) {
      return NextResponse.json({ success: false, error: "Required fields in Step 2 are missing." }, { status: 400 });
    }

    // Step 3 Details
    const ans1 = (data.get("ans1") as string || "").trim();
    const ans2 = (data.get("ans2") as string || "").trim();
    const ans3 = (data.get("ans3") as string || "").trim();

    if (!ans1 || !ans2 || !ans3) {
      return NextResponse.json({ success: false, error: "Required assessment answers are missing." }, { status: 400 });
    }

    // Step 4 Details (Files)
    const resumeFile = data.get("resume") as File | null;
    const idFile = data.get("id") as File | null;
    const nbiFile = data.get("nbi") as File | null;
    const addressFile = data.get("address") as File | null;

    if (!resumeFile || !idFile) {
      return NextResponse.json({ success: false, error: "Resume and Government ID are required uploads." }, { status: 400 });
    }

    // Pre-validate all files (buffers & signatures) before doing any DB changes
    const filesToValidate: { label: string; file: File }[] = [
      { label: "Resume / CV", file: resumeFile },
      { label: "Government-Issued ID", file: idFile }
    ];
    if (nbiFile) filesToValidate.push({ label: "NBI / Police Clearance", file: nbiFile });
    if (addressFile) filesToValidate.push({ label: "Proof of Address", file: addressFile });

    const validatedBuffers: { [key: string]: Buffer } = {};

    for (const item of filesToValidate) {
      const bytes = await item.file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const check = validateFile(buffer, item.file.name, item.file.type);
      if (!check.valid) {
        return NextResponse.json({ success: false, error: `Security check failed for ${item.label}: ${check.error}` }, { status: 400 });
      }
      validatedBuffers[item.label] = buffer;
    }

    // Step 5 Details
    const paymentMethod = data.get("paymentMethod") as string;
    const accountName = (data.get("accountName") as string || "").trim();
    const accountDetails = (data.get("accountDetails") as string || "").trim();

    if (!paymentMethod || !accountName || !accountDetails) {
      return NextResponse.json({ success: false, error: "Required payout information is missing." }, { status: 400 });
    }

    // Step 6 Details
    const interviewDate = data.get("interviewDate") as string;
    const interviewTime = data.get("interviewTime") as string;

    if (!interviewDate || !interviewTime) {
      return NextResponse.json({ success: false, error: "Interview date and time slot selection are required." }, { status: 400 });
    }

    // Database lookup (Prisma parameterized query prevents SQL Injection)
    const existingUser = await db.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 400 });
    }

    // Database Transaction
    await db.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.users.create({
        data: {
          full_name: fullName,
          email: email,
          password_hash: hashPassword(password),
          phone: phone,
          status: "active",
        },
      });

      // 2. Link Virtual Assistant Role
      let role = await tx.roles.findUnique({
        where: { name: "Virtual Assistant" },
      });
      if (!role) {
        role = await tx.roles.create({
          data: {
            name: "Virtual Assistant",
            description: "Virtual Assistant Role",
          },
        });
      }
      await tx.user_roles.create({
        data: {
          user_id: user.id,
          role_id: role.id,
        },
      });

      // 3. Find/Create Niche
      let niche = await tx.niches.findUnique({
        where: { name: nicheName },
      });
      if (!niche) {
        niche = await tx.niches.create({
          data: {
            name: nicheName,
            description: `Niche specialization for ${nicheName}`,
          },
        });
      }

      // 4. Create VA Profile
      const vaProfile = await tx.va_profiles.create({
        data: {
          user_id: user.id,
          experience_level: experience,
          preferred_niche_id: niche.id,
          expected_rate: parseFloat(expectedRate),
          onboarding_status: "pending_interview",
        },
      });

      // 5. Save Skills/Tools
      for (const tool of tools) {
        let skill = await tx.skills.findUnique({
          where: { name: tool },
        });
        if (!skill) {
          skill = await tx.skills.create({
            data: {
              name: tool,
              category: "Tools",
            },
          });
        }
        await tx.va_skills.create({
          data: {
            va_profile_id: vaProfile.id,
            skill_id: skill.id,
            proficiency_level: "Intermediate",
          },
        });
      }

      // 6. Save Assessment Answers
      const assessment = await tx.assessments.create({
        data: {
          va_profile_id: vaProfile.id,
          assessment_type: "Initial Onboarding Assessment",
          status: "pending",
        },
      });

      await tx.assessment_scores.createMany({
        data: [
          {
            assessment_id: assessment.id,
            score_name: "Q1: Client broken link scenario",
            remarks: ans1,
          },
          {
            assessment_id: assessment.id,
            score_name: "Q2: Urgent tasks prioritization",
            remarks: ans2,
          },
          {
            assessment_id: assessment.id,
            score_name: "Q3: Preferred schedule tool",
            remarks: ans3,
          },
        ],
      });

      // 7. Write validated buffers to local storage & save in requirements DB
      const saveFileAndRecord = async (typeName: string, file: File | null) => {
        if (!file) return;

        const buffer = validatedBuffers[typeName];
        if (!buffer) return;

        let reqType = await tx.requirement_types.findUnique({
          where: { name: typeName },
        });
        if (!reqType) {
          reqType = await tx.requirement_types.create({
            data: {
              name: typeName,
              is_required: typeName === "Resume / CV" || typeName === "Government-Issued ID",
            },
          });
        }

        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadsDir, { recursive: true });

        // Path Traversal Mitigation: Using generated secure random filenames on disk
        const fileExt = path.extname(file.name);
        const fileName = `${vaProfile.id}-${typeName.replace(/\s+/g, "_").toLowerCase()}-${Date.now()}${fileExt}`;
        const filePath = path.join(uploadsDir, fileName);
        await fs.writeFile(filePath, buffer);

        const fileUrl = `/uploads/${fileName}`;

        await tx.requirements.create({
          data: {
            va_profile_id: vaProfile.id,
            requirement_type_id: reqType.id,
            file_url: fileUrl,
            file_name: file.name,
            status: "uploaded",
          },
        });
      };

      await saveFileAndRecord("Resume / CV", resumeFile);
      await saveFileAndRecord("Government-Issued ID", idFile);
      await saveFileAndRecord("NBI / Police Clearance", nbiFile);
      await saveFileAndRecord("Proof of Address", addressFile);

      // 8. Create Payment Method Record
      await tx.payment_methods.create({
        data: {
          va_profile_id: vaProfile.id,
          method_type: paymentMethod,
          account_name: accountName,
          masked_details: accountDetails,
          status: "active",
        },
      });

      // 9. Create Scheduled Interview Record
      const dateStr = interviewDate; // "2026-06-28"
      const [timeStr, ampm] = interviewTime.split(" "); // ["10:30", "AM"]
      let [hours, minutes] = timeStr.split(":").map(Number);
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      const scheduledAt = new Date(`${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);

      await tx.interviews.create({
        data: {
          va_profile_id: vaProfile.id,
          interview_title: "Initial Onboarding Interview",
          interview_type: "initial",
          scheduled_at: scheduledAt,
          duration_minutes: 30,
          meeting_platform: "Zoom",
          meeting_link: "https://zoom.us/j/mock-onboarding-link",
          status: "scheduled",
          result: "pending",
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Onboarding submission API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}
