import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: 'admin', description: 'Super Admin' },
    { name: 'finance', description: 'Finance Payroll Accounting' },
    { name: 'employee', description: 'Employee Admin' },
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log("Roles seeded!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
