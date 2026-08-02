import { getSession } from "@/src/lib/auth";
import { RoleGuard } from "@/src/components/shared/RoleGuard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const roles = session?.user?.roles || [];

  return (
    <>
      <RoleGuard roles={roles} />
      {children}
    </>
  );
}
