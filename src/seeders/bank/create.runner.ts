import { seedBanks } from "./create.seeder";

seedBanks()
  .catch((error) => {
    console.log(`Error while seeding banks`);
    console.log(error);
  })
  .finally(() => {
    console.log("Seeding banks finished.");
  });
