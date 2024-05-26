import {
  Users, Movies, Cards, Comments, Bookings, Categories, Photos, Trailers, Actors, MovieCategories,
} from './models/index.js';

async function main() {
  await Users.sync({ alter: true, logging: true });
  await Cards.sync({ alter: true, logging: true });
  await Movies.sync({ alter: true, logging: true });
  await Comments.sync({ alter: true, logging: true });
  await Bookings.sync({ alter: true, logging: true });
  await Categories.sync({ alter: true, logging: true });
  await MovieCategories.sync({ alter: true, logging: true });
  await Photos.sync({ alter: true, logging: true });
  await Trailers.sync({ alter: true, logging: true });
  await Actors.sync({ alter: true, logging: true });
  process.exit(0);
}

main().catch(console.error);
