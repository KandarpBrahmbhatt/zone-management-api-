"use strict";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Zone from "../models/zon.model";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const TOTAL_RECORDS = 1000000; // 10 lakh
// const BATCH_SIZE = 10000;
// // CONNECT DB
// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/zon-project");
//     console.log("MongoDB Connected Successfully");
//   } catch (error) {
//     console.log("MongoDB Connection Error", error);
//     process.exit(1);
//   }
// };
// // Generate data
// const generateZoneData = (start: number, size: number) => {
//   const data = [];
//   for (let i = start; i < start + size; i++) {
//     data.push({
//       zoneName: `Zone ${i + 1}`,
//       zoneCode: `ZONE_${i + 1}`, // UNIQUE SAFE
//       prefix: `PR_${(i % 1000) + 1}`,
//       waterValue: Math.floor(Math.random() * 500),
//       markupValue: Math.floor(Math.random() * 100),
//       increasePercentage: Math.floor(Math.random() * 50),
//       description: `Zone description ${i + 1}`,
//       status: Math.random() > 0.3,
//     });
//   }
//   return data;
// };
// // SEED FUNCTION
// const seedZones = async () => {
//   try {
//     console.time("Zone Seeder");
//     await Zone.deleteMany();
//     for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
//       const batch = generateZoneData(i, BATCH_SIZE);
//       await Zone.insertMany(batch, {
//         ordered: false,
//       });
//       console.log(
//         `Inserted ${Math.min(i + BATCH_SIZE, TOTAL_RECORDS)} / ${TOTAL_RECORDS}`
//       );
//     }
//     console.log(" 10 Lakh Zones Inserted Successfully");
//     console.timeEnd("Zone Seeder");
//     process.exit(0);
//   } catch (error) {
//     console.log(" Seeder Error:", error);
//     process.exit(1);
//   }
// };
// // RUN
// const start = async () => {
//   await connectDB();
//   await seedZones();
// };
// start();
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const zon_model_ts_1 = __importDefault(require("../models/zon.model.ts"));
const country_model_ts_1 = __importDefault(require("../models/country.model.ts"));
const deliveryPostCodePrifix_model_ts_1 = __importDefault(require("../models/deliveryPostCodePrifix.model.ts"));
const deliveryZonePrice_model_ts_1 = __importDefault(require("../models/deliveryZonePrice.model.ts"));
const markuppersentage_model_ts_1 = __importDefault(require("../models/markuppersentage.model.ts"));
dotenv_1.default.config();
const seed = async () => {
    try {
        // MongoDB Connection
        await mongoose_1.default.connect(process.env.MONGO_URL || "mongodb://localhost:27017/zon-project");
        console.log(" Connected DB");
        // OPTIONAL:
        // Delete old data before seeding
        await zon_model_ts_1.default.deleteMany({});
        console.log(" Old Zones Deleted");
        // Fetch required ObjectIds
        const countries = await country_model_ts_1.default.find()
            .select("_id")
            .lean();
        const prefixes = await deliveryPostCodePrifix_model_ts_1.default.find()
            .select("_id")
            .lean();
        const zonePrices = await deliveryZonePrice_model_ts_1.default.find()
            .select("_id")
            .lean();
        const markups = await markuppersentage_model_ts_1.default.find()
            .select("_id")
            .lean();
        // Validation
        if (countries.length === 0 ||
            prefixes.length === 0 ||
            zonePrices.length === 0 ||
            markups.length === 0) {
            console.log(" Dependent collections are empty");
            process.exit(1);
        }
        // Config
        const BATCH_SIZE = 1000;
        const TOTAL = 1000000; // 10 lakh
        console.time("Seeding Time");
        // Batch Insert
        for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
            const zones = [];
            for (let j = 0; j < BATCH_SIZE && i + j < TOTAL; j++) {
                // Random Related ObjectIds
                const country = countries[Math.floor(Math.random() *
                    countries.length)];
                const prefix = prefixes[Math.floor(Math.random() *
                    prefixes.length)];
                const zonePrice = zonePrices[Math.floor(Math.random() *
                    zonePrices.length)];
                const markup = markups[Math.floor(Math.random() *
                    markups.length)];
                zones.push({
                    zoneName: `Zone ${i + j + 1}`,
                    zoneCode: `ZONE-${i + j + 1}`,
                    // Store ObjectIds
                    countryId: country._id,
                    postcodePrefixId: prefix._id,
                    zonePriceId: zonePrice._id,
                    markupId: markup._id,
                    waterValue: Math.floor(Math.random() * 500) + 1,
                    markupValue: Math.floor(Math.random() * 100) + 1,
                    increasePercentage: Math.floor(Math.random() * 50) + 1,
                    description: `Dummy Zone ${i + j + 1}`,
                    status: Math.random() > 0.5,
                });
            }
            // Insert Batch
            await zon_model_ts_1.default.insertMany(zones, {
                ordered: false,
            });
            console.log(` Inserted: ${Math.min(i + BATCH_SIZE, TOTAL)}`);
        }
        console.timeEnd("Seeding Time");
        console.log(" Seeder Completed Successfully");
        process.exit(0);
    }
    catch (error) {
        console.error("Seeder Error:", error);
        process.exit(1);
    }
};
seed();
