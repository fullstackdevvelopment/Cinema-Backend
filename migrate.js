import {
  Users,
  Movies,
  Comments,
  Bookings,
  Categories,
  Photos,
  Trailers,
  Actors,
  MovieCategories,
  MovieStills, Schedule, Rows, Seats, Payment, PendingUsers, PendingPassword,
} from './models/index.js';

async function main() {
  await Users.sync({ alter: true, logging: true });
  await Movies.sync({ alter: true, logging: true });
  await Comments.sync({ alter: true, logging: true });
  await Bookings.sync({ alter: true, logging: true });
  await Categories.sync({ alter: true, logging: true });
  await MovieCategories.sync({ alter: true, logging: true });
  await Photos.sync({ alter: true, logging: true });
  await Trailers.sync({ alter: true, logging: true });
  await Actors.sync({ alter: true, logging: true });
  await MovieStills.sync({ alter: true, logging: true });
  await Schedule.sync({ alter: true, logging: true });
  await Rows.sync({ alter: true, logging: true });
  await Seats.sync({ alter: true, logging: true });
  await Payment.sync({ alter: true, logging: true });
  await PendingUsers.sync({ alter: true, logging: true });
  await PendingPassword.sync({ alter: true, logging: true });
  process.exit(0);
}

main().catch(console.error);
