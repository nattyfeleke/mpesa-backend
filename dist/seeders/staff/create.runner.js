"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_seeder_1 = require("./create.seeder");
(0, create_seeder_1.seedStaff)().catch((error) => {
    console.log(`Error while seeding staff`);
    console.log(error);
}).finally(() => {
    console.log('Seeding staff finished successfully.');
});
