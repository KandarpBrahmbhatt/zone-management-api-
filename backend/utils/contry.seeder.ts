import mongoose from "mongoose";
import dotenv from "dotenv";
import Country from "../models/country.model";

dotenv.config();

const TOTAL_RECORDS = 200; // 10 lakh
const BATCH_SIZE = 100;

// DB connection (same style as yours)
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/");
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error", error);
    process.exit(1);
  }
};

// Generate fake country data
const generateCountryData = (startIndex: number, batchSize: number) => {
  const countries = [];

  for (let i = startIndex; i < startIndex + batchSize; i++) {
    countries.push({
      CountryName: `Country ${i + 1}`,
      countryCode: `C${String(i + 1).padStart(5, "0")}`, // unique code
      phoneCode: `+${Math.floor(1 + Math.random() * 999)}`,
      currency: `CUR${i + 1}`,
      status: Math.random() > 0.2, // mostly active
    });
  }

  return countries;
};

// Seeder function
const seedCountries = async () => {
  try {
    console.time("Country Seeder Finished");

    // Optional: clean old data
    await Country.deleteMany();

    for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
      const countryData = generateCountryData(i, BATCH_SIZE);

      await Country.insertMany(countryData, {
        ordered: false,
      });

      console.log(
        `Inserted ${Math.min(i + BATCH_SIZE, TOTAL_RECORDS)} / ${TOTAL_RECORDS}`
      );
    }

    console.log("10 Lakh Country Data Inserted Successfully");

    console.timeEnd("Country Seeder Finished");

    process.exit(0);
  } catch (error) {
    console.log("Country Seeder Error:", error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(() => {
  seedCountries();
});