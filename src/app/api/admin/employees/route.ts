import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    const sessionUser = await requireRole("admin");
    const isSuperAdmin = sessionUser.roles.includes("admin");

    // Fetch users who have internal roles (admin, finance, employee)
    const internalRoles = await prisma.roles.findMany({
      where: { name: { in: ["admin", "finance", "employee"] } }
    });
    
    const roleIds = internalRoles.map(r => r.id);

    if (roleIds.length === 0) {
      return NextResponse.json({ employees: [] });
    }

    const employeesRaw = await prisma.users.findMany({
      where: {
        user_roles: {
          some: { role_id: { in: roleIds } }
        }
      },
      include: {
        user_roles: {
          include: { roles: true }
        },
        internal_staff_profiles: true
      },
      orderBy: { created_at: 'desc' }
    });

    const formattedEmployees = employeesRaw.map(user => {
      // Find the internal role
      const internalUserRole = user.user_roles.find(ur => roleIds.includes(ur.role_id));
      const roleName = internalUserRole?.roles?.name || "unknown";

      return {
        id: user.id.toString(),
        name: user.full_name || "Unknown Employee",
        email: user.email,
        role: roleName,
        joined: user.created_at ? user.created_at.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Unknown",
        status: (user.account_status || "Active").charAt(0).toUpperCase() + (user.account_status || "active").slice(1),
        hourlyRate: user.internal_staff_profiles?.hourly_rate ? Number(user.internal_staff_profiles.hourly_rate) : 0,
        workSchedule: user.internal_staff_profiles?.work_schedule || "Full-Time"
      };
    });

    return NextResponse.json({ employees: formattedEmployees, isSuperAdmin });

  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole("admin");
    const { userId, newRoleName, hourlyRate, workSchedule } = await req.json();

    if (!userId || (!newRoleName && hourlyRate === undefined && !workSchedule)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newRoleName) {
      // Find the new role ID
      const role = await prisma.roles.findUnique({
        where: { name: newRoleName }
      });

      if (!role) {
        return NextResponse.json({ error: "Role not found" }, { status: 404 });
      }

      // Since a user can only have one internal role for this dashboard context, 
      // we delete any existing internal roles (admin, finance, employee) and add the new one.
      const internalRoles = await prisma.roles.findMany({
        where: { name: { in: ["admin", "finance", "employee"] } }
      });
      const internalRoleIds = internalRoles.map(r => r.id);

      // Delete existing internal role links
      await prisma.user_roles.deleteMany({
        where: {
          user_id: BigInt(userId),
          role_id: { in: internalRoleIds }
        }
      });

      // Create new role link
      await prisma.user_roles.create({
        data: {
          user_id: BigInt(userId),
          role_id: role.id
        }
      });
    }

    // Update internal staff profile if rate or schedule provided
    if (hourlyRate !== undefined || workSchedule !== undefined) {
      await prisma.internal_staff_profiles.upsert({
        where: { user_id: BigInt(userId) },
        update: {
          hourly_rate: hourlyRate !== undefined ? hourlyRate : undefined,
          work_schedule: workSchedule !== undefined ? workSchedule : undefined
        },
        create: {
          user_id: BigInt(userId),
          hourly_rate: hourlyRate !== undefined ? hourlyRate : 0,
          work_schedule: workSchedule || "Full-Time"
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Failed to update employee role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
