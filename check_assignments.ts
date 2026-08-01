import { db } from "./src/lib/db.js";

async function main() {
  const assignments = await db.assignments.findMany({ include: { va_profiles: { include: { users: true } } } });
  console.log(JSON.stringify(assignments, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
