import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";
import { promises as fs } from "fs";
import path from "path";

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

    // Process file upload locally
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalExt = path.extname(file.name) || ".png";
    const filename = `receipt-${invoiceIdStr}-${uniqueSuffix}${originalExt}`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "receipts");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/receipts/${filename}`;

    // Create receipt record
    await prisma.invoice_receipts.create({
      data: {
        invoice_id: invoiceId,
        file_url: fileUrl,
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
