"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoneDelteCron = exports.startZoneCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const zon_model_1 = __importDefault(require("../models/zon.model"));
// import Country from "../models/country.model.js";
// import DeliveryPostcodePrefix from "../models/deliveryPostCodePrifix.model";
// import DeliveryZonePrice from "../models/deliveryZonePrice.model.js";
// import Markup from "../models/markuppersentage.model";
const startZoneCron = () => {
    console.log(" Zone Cron Started");
    // Every 10 seconds
    node_cron_1.default.schedule("*/4 * * * * *", async () => {
        try {
            const timeLimit = new Date(Date.now() - 60 * 1000); // 1 min old Delete all Zone who were created before 1 minute ago
            const result = await zon_model_1.default.deleteMany({
                createdAt: { $lt: timeLimit }
            });
            console.log("Deleted users:", result.deletedCount);
        }
        catch (error) {
            console.log("Cron Delete Error:", error);
        }
    });
};
exports.startZoneCron = startZoneCron;
const zoneDelteCron = () => {
    node_cron_1.default.schedule("*/4 * * * * *", async () => {
        try {
            const timeLimit = new Date(Date.now() - 60 * 1000);
            const result = await zon_model_1.default.deleteMany({
                createdAt: { $lt: timeLimit }
            });
            console.log("zoneDeletedCron suessfully", result.deletedCount);
        }
        catch (error) {
            console.log("zonecron deleted error", error);
        }
    });
};
exports.zoneDelteCron = zoneDelteCron;
// export const startFakeZoneCron =
//   () => {
//     console.log(
//       "Fake Zone Cron Started"
//     );
//     // Every 11 seconds
//     cron.schedule(
//       "*/11 * * * * *",
//       async () => {
//         try {
//           console.log(
//             "Creating fake zone..."
//           );
//           // Random country
//           const country =
//             await Country.aggregate([
//               {
//                 $sample: {
//                   size: 1,
//                 },
//               },
//             ]);
//           const postcode =
//             await DeliveryPostcodePrefix.aggregate(
//               [
//                 {
//                   $sample: {
//                     size: 1,
//                   },
//                 },
//               ]
//             );
//           const zonePrice =
//             await DeliveryZonePrice.aggregate(
//               [
//                 {
//                   $sample: {
//                     size: 1,
//                   },
//                 },
//               ]
//             );
//           const markup =
//             await Markup.aggregate([
//               {
//                 $sample: {
//                   size: 1,
//                 },
//               },
//             ]);
//           if (
//             !country.length ||
//             !postcode.length ||
//             !zonePrice.length ||
//             !markup.length
//           ) {
//             console.log(
//               "Missing dependency data"
//             );
//             return;
//           }
//           const fakeZone =
//             await Zone.create({
//               zoneName:
//                 faker.location.city(),
//               zoneCode:
//                 faker.string.alphanumeric(
//                   8
//                 ),
//               countryId:
//                 country[0]._id,
//               postcodePrefixId:
//                 postcode[0]._id,
//               zonePriceId:
//                 zonePrice[0]._id,
//               markupId:
//                 markup[0]._id,
//               waterValue:
//                 faker.number.int({
//                   min: 10,
//                   max: 100,
//                 }),
//               markupValue:
//                 faker.number.int({
//                   min: 1,
//                   max: 50,
//                 }),
//               increasePercentage:
//                 faker.number.int({
//                   min: 1,
//                   max: 20,
//                 }),
//               description:
//                 faker.lorem.sentence(),
//               status:
//                 faker.datatype.boolean(),
//             });
//           console.log(
//             "Fake zone inserted:",
//             fakeZone.zoneName
//           );
//         } catch (error) {
//           console.error(
//             "Fake Cron Error:",
//             error
//           );
//         }
//       }
//     );
//   };
