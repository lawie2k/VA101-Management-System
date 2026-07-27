// ============================================================
// Role Constants
// ============================================================

export const ROLES = {
  SUPER_ADMIN: "admin",
  FINANCE: "finance",
  EMPLOYEE: "employee",
  VA: "va",
  CLIENT: "client",
  TRAINER: "trainer",
  STUDENT: "student",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

// ============================================================
// Role Categories
// ============================================================

export const INTERNAL_ROLES: RoleName[] = [
  ROLES.SUPER_ADMIN,
  ROLES.FINANCE,
  ROLES.EMPLOYEE,
];

export const EXTERNAL_ROLES: RoleName[] = [
  ROLES.VA,
  ROLES.CLIENT,
  ROLES.TRAINER,
  ROLES.STUDENT,
];

export function isInternal(role: string): boolean {
  return INTERNAL_ROLES.includes(role as RoleName);
}

export function isExternal(role: string): boolean {
  return EXTERNAL_ROLES.includes(role as RoleName);
}

// ============================================================
// Role Display Names & Colors
// ============================================================

export const ROLE_LABELS: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.FINANCE]: "Finance",
  [ROLES.EMPLOYEE]: "Employee",
  [ROLES.VA]: "Virtual Assistant",
  [ROLES.CLIENT]: "Client",
  [ROLES.TRAINER]: "Trainer",
  [ROLES.STUDENT]: "Student",
};

export const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  [ROLES.SUPER_ADMIN]: { bg: "bg-purple-100", text: "text-purple-700" },
  [ROLES.FINANCE]: { bg: "bg-emerald-100", text: "text-emerald-700" },
  [ROLES.EMPLOYEE]: { bg: "bg-blue-100", text: "text-blue-700" },
  [ROLES.VA]: { bg: "bg-sky-100", text: "text-sky-700" },
  [ROLES.CLIENT]: { bg: "bg-amber-100", text: "text-amber-700" },
  [ROLES.TRAINER]: { bg: "bg-indigo-100", text: "text-indigo-700" },
  [ROLES.STUDENT]: { bg: "bg-rose-100", text: "text-rose-700" },
};

// ============================================================
// Dashboard Routes per Role
// ============================================================

export const ROLE_DASHBOARD_ROUTES: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: "/admin/dashboard",
  [ROLES.FINANCE]: "/admin/dashboard",
  [ROLES.EMPLOYEE]: "/admin/dashboard",
  [ROLES.VA]: "/va/dashboard",
  [ROLES.CLIENT]: "/client/dashboard",
  [ROLES.TRAINER]: "/trainer/dashboard",
  [ROLES.STUDENT]: "/student/dashboard",
};

/**
 * Get the dashboard route for the user's primary role.
 * Priority: super_admin > finance > employee > client > va > trainer > student
 */
export function getDashboardRoute(roles: string[]): string {
  const priority: RoleName[] = [
    ROLES.SUPER_ADMIN,
    ROLES.FINANCE,
    ROLES.EMPLOYEE,
    ROLES.CLIENT,
    ROLES.VA,
    ROLES.TRAINER,
    ROLES.STUDENT,
  ];

  for (const role of priority) {
    if (roles.includes(role)) {
      return ROLE_DASHBOARD_ROUTES[role];
    }
  }

  return "/login";
}

/**
 * Get the primary role for display purposes.
 */
export function getPrimaryRole(roles: string[]): string {
  const priority: RoleName[] = [
    ROLES.SUPER_ADMIN,
    ROLES.FINANCE,
    ROLES.EMPLOYEE,
    ROLES.CLIENT,
    ROLES.VA,
    ROLES.TRAINER,
    ROLES.STUDENT,
  ];

  for (const role of priority) {
    if (roles.includes(role)) {
      return role;
    }
  }

  return roles[0] || "unknown";
}

// ============================================================
// Permission Checks
// ============================================================

/**
 * Check if user has any of the allowed roles.
 */
export function canAccess(
  userRoles: string[],
  ...allowedRoles: string[]
): boolean {
  // Super admin can access everything
  if (userRoles.includes(ROLES.SUPER_ADMIN)) return true;
  return userRoles.some((role) => allowedRoles.includes(role));
}

/**
 * Check if user has admin-level access (super_admin or employee).
 */
export function isAdmin(userRoles: string[]): boolean {
  return canAccess(userRoles, ROLES.SUPER_ADMIN, ROLES.EMPLOYEE);
}

/**
 * Check if user has finance access.
 */
export function isFinance(userRoles: string[]): boolean {
  return canAccess(userRoles, ROLES.SUPER_ADMIN, ROLES.FINANCE);
}

// ============================================================
// Registration-Eligible Roles (external users can self-register)
// ============================================================

export const REGISTERABLE_ROLES: RoleName[] = [
  ROLES.VA,
  ROLES.CLIENT,
  ROLES.TRAINER,
  ROLES.STUDENT,
];

export function isRegisterableRole(role: string): boolean {
  return REGISTERABLE_ROLES.includes(role as RoleName);
}
