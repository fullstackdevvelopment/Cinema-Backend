import {
  Users, Movies, Cards, Comments, Bookings, ResetToken,
} from './models/index.js';

async function main() {
  await Users.sync({ alter: true, logging: true });
  await Cards.sync({ alter: true, logging: true });
  await Movies.sync({ alter: true, logging: true });
  await Comments.sync({ alter: true, logging: true });
  await Bookings.sync({ alter: true, logging: true });
  await ResetToken.sync({ alter: true, logging: true });
  process.exit(0);
}

main().catch(console.error);
