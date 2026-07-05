import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const trainer = await prisma.trainer_profiles.findFirst();
  if (!trainer) {
    console.log("No trainers found to attach material to.");
    return;
  }
  
  let category = await prisma.training_categories.findFirst({ where: { name: "Operations" }});
  if (!category) {
    category = await prisma.training_categories.create({ data: { name: "Operations" }});
  }

  const mat = await prisma.training_materials.create({
    data: {
      trainer_profile_id: trainer.id,
      category_id: category.id,
      title: "Test Uploaded Material by Trainer",
      description: "This is a test material that was automatically generated.",
      price: 19.99,
      status: "active",
      platform_commission_rate: 30.00
    }
  });

  console.log("Seeded test material", mat);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
