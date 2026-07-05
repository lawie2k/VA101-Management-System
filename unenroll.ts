import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const course = await prisma.training_materials.findFirst({
    where: { title: "Test Uploaded Material by Trainer" }
  });

  if (!course) {
    console.log("Course not found");
    return;
  }

  console.log("Course ID:", course.id);

  const deletedAccess = await prisma.learning_access.deleteMany({
    where: { training_material_id: course.id }
  });
  console.log("Deleted learning_access records:", deletedAccess.count);

  const deletedPurchases = await prisma.training_purchases.deleteMany({
    where: { training_material_id: course.id }
  });
  console.log("Deleted training_purchases records:", deletedPurchases.count);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
