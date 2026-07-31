import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";
import { uploadToS3, getSignedFileUrl } from "@/src/lib/s3";

export async function POST(req: Request) {
  try {
    const currentUser = await requireRole("client");
    const userId = currentUser.id;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const invoiceIdStr = formData.get("invoiceId") as string | null;
    const remarks = formData.get("remarks") as string | null;

    if (!file || !invoiceIdStr) {
      return NextResponse.json({ error: "Missing file or invoice ID" }, { status: 400 });
    }

    const invoiceId = BigInt(invoiceIdStr);

    // Ensure the invoice belongs to the client
    const invoice = await prisma.invoices.findFirst({
      where: { 
        id: invoiceId,
        client_profiles: {
          user_id: BigInt(userId)
        }
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found or unauthorized" }, { status: 404 });
    }

    // Upload file to S3 (Private folder since receipts are sensitive)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const s3Key = await uploadToS3({
      fileBuffer: buffer,
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      isPublic: false
    });

    // Generate a signed URL for immediate access in the client response
    const fileUrl = await getSignedFileUrl(s3Key);

    // Create receipt record
    await prisma.invoice_receipts.create({
      data: {
        invoice_id: invoiceId,
        file_url: s3Key, // Store the S3 Key in the DB, not the expiring signed URL
        file_name: file.name,
        uploaded_by: BigInt(userId),
        remarks: remarks || null,
        verification_status: "pending_review"
      }
    });

    // Update invoice status
    await prisma.invoices.update({
      where: { id: invoiceId },
      data: { status: "Pending Review" }
    });

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.error("Failed to upload receipt:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
