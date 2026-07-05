import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const clients = await prisma.client_profiles.findMany();
  
  if (clients.length === 0) {
    console.log("No client profiles found!");
    return;
  }

  for (const activeClient of clients) {
    const inv = await prisma.invoices.create({
      data: {
        client_profile_id: activeClient.id,
        invoice_number: `INV-${Date.now()}-${activeClient.id}`,
        amount: 500.00,
        currency: "USD",
        status: "unpaid",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    console.log(`Created invoice for client ${activeClient.id}`, inv.invoice_number);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
