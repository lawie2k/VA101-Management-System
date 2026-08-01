import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    // Determine the permissions based on role
    const isSuperAdmin = user.roles.includes("admin");
    const isEmployeeAdmin = user.roles.includes("employee");

    if (!isSuperAdmin && !isEmployeeAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Determine which roles this admin is allowed to see
    // Super Admin sees: admin, finance, employee
    // Employee Admin sees: va
    const allowedRoles = isSuperAdmin ? ["admin", "finance", "employee"] : ["va"];

    const leaveRequests = await prisma.leave_requests.findMany({
      where: {
        users: {
          user_roles: {
            some: {
              roles: {
                name: {
                  in: allowedRoles
                }
              }
            }
          }
        }
      },
      include: {
        users: {
          select: {
            full_name: true,
            email: true
          }
        }
      },
      orderBy: { created_at: "desc" }
    });

    const serialized = leaveRequests.map(leave => ({
      ...leave,
      id: leave.id.toString(),
      user_id: leave.user_id.toString(),
      reviewed_by: leave.reviewed_by?.toString() || null,
      userName: leave.users.full_name,
      userEmail: leave.users.email
    }));

    return NextResponse.json({ leaveRequests: serialized });
  } catch (error: any) {
    console.error("Failed to fetch leave requests:", error);
    if (error.name === "AuthError") {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireAuth();
    
    const isSuperAdmin = user.roles.includes("admin");
    const isEmployeeAdmin = user.roles.includes("employee");

    if (!isSuperAdmin && !isEmployeeAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { leaveId, status, adminRemarks } = await req.json();

    if (!leaveId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status or leave ID" }, { status: 400 });
    }

    // Make sure they have permission to update THIS leave request
    const leaveRequest = await prisma.leave_requests.findUnique({
      where: { id: BigInt(leaveId) },
      include: {
        users: {
          include: {
            user_roles: {
              include: { roles: true }
            }
          }
        }
      }
    });

    if (!leaveRequest) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 });
    }

    const targetUserRoles = leaveRequest.users.user_roles.map(ur => ur.roles.name);
    
    if (isEmployeeAdmin && !isSuperAdmin) {
      // Employee Admin can only approve VA leaves
      if (!targetUserRoles.includes("va")) {
         return NextResponse.json({ error: "Forbidden. You can only manage VA leaves." }, { status: 403 });
      }
    }

    const updated = await prisma.leave_requests.update({
      where: { id: BigInt(leaveId) },
      data: {
        status,
        admin_remarks: adminRemarks || null,
        reviewed_by: BigInt(user.id),
        reviewed_at: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update leave request:", error);
    if (error.name === "AuthError") {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
