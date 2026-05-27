// import cron from "node-cron";
// import Zone from "../models/zon.model";

// export const startZoneCron = () => {
//         console.log(" Zone Cron Started");

//         // Every 10 seconds
//         cron.schedule("*/4 * * * * *", async () => {
//             try {
//                 const timeLimit = new Date(Date.now() - 60 * 1000); // 1 min old Delete all Zone who were created before 1 minute ago

//                 const result = await Zone.deleteMany({
//                     createdAt: { $lt: timeLimit }
//                 });

//                 console.log("Deleted zone:", result.deletedCount);

//             } catch (error) {
//                 console.log("Cron Delete Error:", error);
//             }
//         });
//     };


import cron from "node-cron";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

import Zone from "../models/zon.model";
import Country from "../models/country.model";
import DeliveryPostcodePrefix from "../models/deliveryPostCodePrifix.model";
import DeliveryZonePrice from "../models/deliveryZonePrice.model";
import DeliveryMarkupPercentage from "../models/markuppersentage.model";

export const startZoneCron = () => {
  console.log("Zone Cron Started");

  // Create new zone every 5 seconds
  cron.schedule("*/5 * * * * *", async () => {
    try {
      // Get random existing relation data
      const country = await Country.findOne();
      const postcode = await DeliveryPostcodePrefix.findOne();
      const zonePrice = await DeliveryZonePrice.findOne();
      const markup = await DeliveryMarkupPercentage.findOne();

      // Prevent error if related data not found
      if (!country || !postcode || !zonePrice || !markup) {
        console.log(" Required relation data missing");
        return;
      }

      const newZone = await Zone.create({
        zoneName: faker.location.city() + " Zone",
        zoneCode: `ZONE-${faker.string.alphanumeric(6)}`,

        countryId: country._id,
        postcodePrefixId: postcode._id,
        zonePriceId: zonePrice._id,
        markupId: markup._id,

        waterValue: faker.number.int({
          min: 10,
          max: 100,
        }),

        markupValue: faker.number.int({
          min: 5,
          max: 50,
        }),

        increasePercentage: faker.number.int({
          min: 1,
          max: 20,
        }),

        description: faker.lorem.sentence(),
        status: true,
      });

      console.log(
        "Zone Created:",
        newZone.zoneName
      );
    } catch (error: any) {
      console.error(
        " Zone Create Cron Error:",
        error.message
      );
    }
  });

  // Delete zones older than 1 minute every 4 seconds
  cron.schedule("*/4 * * * * *", async () => {
    try {
      const timeLimit = new Date(Date.now() - 60 * 1000);

      const result = await Zone.deleteMany({createdAt: { $lt: timeLimit },});

      console.log(" Deleted zones:",result.deletedCount);
    } catch (error: any) {
      console.log("Cron Delete Error:",error.message);
    }
  });
};
