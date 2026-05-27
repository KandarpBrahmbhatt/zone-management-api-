"use strict";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import DeliveryZonePrice from "../models/deliveryZonePrice.model";
// import Zone from "../models/zon.model";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const TOTAL_RECORDS = 1000000; // 10 lakh
// const BATCH_SIZE = 10000;
// // DB CONNECT
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
// const generateData = (startIndex: number, batchSize: number, zones: any[]) => {
//   const data = [];
//   for (let i = startIndex; i < startIndex + batchSize; i++) {
//     data.push({
//       postcodePrefixId: zones[i % zones.length]._id,
//       price: Math.floor(Math.random() * 1000) + 50,
//       currency: "INR",
//       status: Math.random() > 0.2,
//     //   description: `Zone price ${i + 1}`,
//     });
//   }
//   return data;
// };
// // SEED FUNCTION
// const seedDeliveryZonePrice = async () => {
//   try {
//     console.time("Seeder Time");
//     await DeliveryZonePrice.deleteMany();
//     // STEP 1: Get zones
//     const zones = await Zone.find({}, { _id: 1 });
//     if (!zones.length) {
//       throw new Error("No zones found. Please seed zones first.");
//     }
//     // STEP 2: Insert batches
//     for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
//       const batch = generateData(i, BATCH_SIZE, zones);
//       await DeliveryZonePrice.insertMany(batch, {
//         ordered: false,
//       });
//       console.log(
//         `Inserted ${Math.min(i + BATCH_SIZE, TOTAL_RECORDS)} / ${TOTAL_RECORDS}`
//       );
//     }
//     console.log("10 Lakh DeliveryZonePrice inserted");
//     console.timeEnd("Seeder Time");
//     process.exit(0);
//   } catch (error) {
//     console.log("Seeder Error:", error);
//     process.exit(1);
//   }
// };
// // RUN
// const start = async () => {
//   await connectDB();
//   await seedDeliveryZonePrice();
// };
// start();
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const deliveryZonePrice_model_1 = __importDefault(require("../models/deliveryZonePrice.model"));
const zon_model_1 = __importDefault(require("../models/zon.model"));
dotenv_1.default.config();
const TOTAL_RECORDS = 1000000; // 10 lakh
const BATCH_SIZE = 10000;
// DB CONNECT
const connectDB = async () => {
    try {
        await mongoose_1.default.connect("mongodb://localhost:27017/zon-project");
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.log("MongoDB Connection Error", error);
        process.exit(1);
    }
};
// Generate Batch Data
const generateData = (startIndex, batchSize, zones) => {
    const data = [];
    for (let i = startIndex; i < startIndex + batchSize; i++) {
        const minWeight = Math.floor(Math.random() * 5);
        const maxWeight = minWeight + Math.floor(Math.random() * 10) + 1;
        data.push({
            postcodePrefixId: new mongoose_1.default.Types.ObjectId(zones[i % zones.length]._id),
            minWeight,
            maxWeight,
            basePrice: Math.floor(Math.random() * 1000) + 50,
            status: Math.random() > 0.2,
        });
    }
    return data;
};
// SEED FUNCTION
const seed = async () => {
    try {
        console.time("Seeder Time");
        // optional fast clear
        await deliveryZonePrice_model_1.default.collection.drop().catch(() => { });
        // fetch zones
        const zones = await zon_model_1.default.find({}, { _id: 1 });
        if (!zones.length) {
            throw new Error("No zones found. Seed zones first.");
        }
        console.log(`Zones loaded: ${zones.length}`);
        // batch insert
        for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
            const batch = generateData(i, BATCH_SIZE, zones);
            await deliveryZonePrice_model_1.default.insertMany(batch, {
                ordered: false,
            });
            console.log(`Inserted ${i + BATCH_SIZE} / ${TOTAL_RECORDS}`);
        }
        console.log("Seeder completed: 10 lakh records inserted");
        console.timeEnd("Seeder Time");
        process.exit(0);
    }
    catch (error) {
        console.log("Seeder Error:", error);
        process.exit(1);
    }
};
// RUN
const start = async () => {
    await connectDB();
    await seed();
};
start();
