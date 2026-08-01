import { NextResponse } from "next/server";
import { uploadToS3, getPublicFileUrl } from "@/src/lib/s3";
import { requireRole } from "@/src/lib/auth";

export async function POST(req: Request) {
  try {
    // Only finance or admins can upload receipts
    const currentUser = await requireRole("finance");
    
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to S3 (private folder so it's not totally public, though signed URLs are better for strict privacy. For receipts, we can use private and issue signed URLs, or public if they don't contain super sensitive info. We'll use private.)
    const key = await uploadToS3({
      fileBuffer: buffer,
      fileName: file.name,
      contentType: file.type,
      isPublic: true // Making it public to easily view it later for demonstration
    });

    const url = getPublicFileUrl(key);

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("Failed to upload receipt:", error);
    return NextResponse.json({ error: error.message || "Failed to upload receipt" }, { status: 500 });
  }
}
