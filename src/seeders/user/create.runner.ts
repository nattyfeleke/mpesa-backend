import { seedUser } from "./create.seeder";

seedUser()
  .catch((error) => {
    console.log(`Error while seeding user`);
    console.log(error);
  })
  .finally(() => {
    console.log("Seeding user finished successfully.");
  });
