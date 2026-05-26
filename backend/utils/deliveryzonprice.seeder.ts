import mongoose from "mongoose";
import dotenv from "dotenv";
import DeliveryZonePrice from "../models/deliveryZonePrice.model";
import Zone from "../models/zon.model";

dotenv.config();

const TOTAL_RECORDS = 1000000; // 10 lakh
const BATCH_SIZE = 10000;

// DB CONNECT
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/zon-project");
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error", error);
    process.exit(1);
  }
};

// Generate data
const generateData = (startIndex: number, batchSize: number, zones: any[]) => {
  const data = [];

  for (let i = startIndex; i < startIndex + batchSize; i++) {
    data.push({
      zoneId: zones[i % zones.length]._id,
      price: Math.floor(Math.random() * 1000) + 50,
      currency: "INR",
      status: Math.random() > 0.2,
      description: `Zone price ${i + 1}`,
    });
  }

  return data;
};

// SEED FUNCTION
const seedDeliveryZonePrice = async () => {
  try {
    console.time("Seeder Time");

    await DeliveryZonePrice.deleteMany();

    // STEP 1: Get zones
    const zones = await Zone.find({}, { _id: 1 });

    if (!zones.length) {
      throw new Error("No zones found. Please seed zones first.");
    }

    // STEP 2: Insert batches
    for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
      const batch = generateData(i, BATCH_SIZE, zones);

      await DeliveryZonePrice.insertMany(batch, {
        ordered: false,
      });

      console.log(
        `Inserted ${Math.min(i + BATCH_SIZE, TOTAL_RECORDS)} / ${TOTAL_RECORDS}`
      );
    }

    console.log("10 Lakh DeliveryZonePrice inserted");
    console.timeEnd("Seeder Time");

    process.exit(0);
  } catch (error) {
    console.log("Seeder Error:", error);
    process.exit(1);
  }
};

// RUN
const start = async () => {
  await connectDB();
  await seedDeliveryZonePrice();
};

start();