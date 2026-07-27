import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { requireRole } from "@/src/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole("admin");

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
        }
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
        status: (user.account_status || "Active").charAt(0).toUpperCase() + (user.account_status || "active").slice(1)
      };
    });

    return NextResponse.json({ employees: formattedEmployees });

  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole("admin");
    const { userId, newRoleName } = await req.json();

    if (!userId || !newRoleName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Failed to update employee role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
