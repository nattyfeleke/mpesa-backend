"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_seeder_1 = require("./create.seeder");
(0, create_seeder_1.seedUser)()
    .catch((error) => {
    console.log(`Error while seeding user`);
    console.log(error);
})
    .finally(() => {
    console.log("Seeding user finished successfully.");
});
