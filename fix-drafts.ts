import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const res = await prisma.training_materials.updateMany({
    where: { status: "draft" },
    data: { status: "active" }
  });
  console.log("Updated", res.count, "materials from draft to active.");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
