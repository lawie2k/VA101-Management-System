import { db } from './src/lib/db';
async function main() {
  const materials = await db.training_materials.findMany();
  console.log(materials.map(m => ({ title: m.title, price: m.price })));
}
main().catch(console.error);
