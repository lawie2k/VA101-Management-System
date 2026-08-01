import { db } from "./src/lib/db";

async function main() {
  const user = await db.users.findFirst({ where: { email: "va1@gmail.com" } });
  if (!user) return console.log("User not found");
  
  const payouts = await db.payouts.findMany({ where: { recipient_user_id: user.id } });
  console.log("Payouts for va1@gmail.com:", payouts);
  
  const roles = await db.user_roles.findMany({ where: { user_id: user.id }, include: { roles: true } });
  console.log("Roles for va1@gmail.com:", roles.map(r => r.roles.name));
}

main().catch(console.error).finally(() => process.exit(0));
