import { Users } from './models/index.js';

async function main() {
  await Users.sync({ alter: true, logging: true });
  process.exit(0);
}

main().catch(console.error);
