import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

// Needed to properly serialize BigInts
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  try {
    await requireRole("admin");
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const contracts = await prisma.contracts.findMany({
      where: search ? {
        OR: [
          { va_profiles: { users: { full_name: { contains: search } } } },
          { client_profiles: { company_name: { contains: search } } }
        ]
      } : {},
      orderBy: { created_at: "desc" },
      include: {
        va_profiles: {
          include: { users: true }
        },
        client_profiles: true
      }
    });

    const formattedContracts = contracts.map((contract) => {
      // Format the date string
      const dateStr = contract.created_at 
        ? new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(contract.created_at)
        : "Unknown Date";

      return {
        id: `CTR-${contract.id}`,
        date: dateStr,
        va: contract.va_profiles?.users?.full_name || "Unknown VA",
        client: contract.client_profiles?.company_name || "Unknown Client",
        status: contract.status === "active" ? "Active" : contract.status === "draft" ? "Draft" : contract.status === "completed" ? "Completed" : "Active",
        fileUrl: contract.file_url,
        signedFileUrl: contract.signed_file_url
      };
    });

    return NextResponse.json({ contracts: formattedContracts });

  } catch (error) {
    console.error("Failed to fetch contracts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await requireRole("admin");
    const { contractId, fileUrl } = await req.json();

    if (!contractId || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Extract the numeric ID from CTR-xxx
    const numericId = contractId.toString().replace('CTR-', '');

    await prisma.contracts.update({
      where: { id: BigInt(numericId) },
      data: {
        file_url: fileUrl,
        status: "pending_signature", // Update status since it's now uploaded
        uploaded_by: BigInt(currentUser.id)
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Failed to update contract:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
