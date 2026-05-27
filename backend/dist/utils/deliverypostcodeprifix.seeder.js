"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const deliveryPostCodePrifix_model_1 = __importDefault(require("../models/deliveryPostCodePrifix.model"));
const country_model_1 = __importDefault(require("../models/country.model"));
dotenv_1.default.config();
const TOTAL_RECORDS = 1000000; // 10 lakh
const BATCH_SIZE = 10000;
const connectDB = async () => {
    try {
        await mongoose_1.default.connect("mongodb://localhost:27017/zon-project");
        console.log("MongoDB Connected Successfully");
    }
    catch (error) {
        console.log("MongoDB Connection Error", error);
        process.exit(1);
    }
};
// Get or create dummy countries first aa contry ni seeder thi run karavanu aahiyaj lakhiyu 6e.
const createCountries = async () => {
    await country_model_1.default.deleteMany();
    const countries = [];
    for (let i = 0; i < 200; i++) {
        countries.push({
            countryName: `Country ${i + 1}`,
            countryCode: `C${String(i + 1).padStart(5, "0")}`, // unique code
            // phoneCode: `+${Math.floor(1 + Math.random() * 999)}`,
            currency: `CUR${i + 1}`,
            status: Math.random() > 0.2, // mostly active
        });
    }
    const result = await country_model_1.default.insertMany(countries);
    console.log("Countries created:", result.length);
    return result;
};
// Generate batch data
const generateData = (startIndex, batchSize, countryIds) => {
    const data = [];
    for (let i = startIndex; i < startIndex + batchSize; i++) {
        data.push({
            countryId: new mongoose_1.default.Types.ObjectId(countryIds[i % countryIds.length]._id),
            prefix: `DP${String(i + 1).padStart(7, "0")}`, // unique
            description: `Delivery postcode prefix ${i + 1}`,
            status: Math.random() > 0.2,
            countryCode: countryIds[i % countryIds.length]._id, // FIXED ObjectId
        });
    }
    return data;
};
const seed = async () => {
    try {
        console.time("Seeder Time");
        await deliveryPostCodePrifix_model_1.default.deleteMany();
        // STEP 1: create countries
        const countries = await createCountries();
        // STEP 2: insert 10 lakh records
        for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
            const batch = generateData(i, BATCH_SIZE, countries);
            const result = await deliveryPostCodePrifix_model_1.default.insertMany(batch, {
                ordered: false,
            });
            console.log(`Inserted ${Math.min(i + BATCH_SIZE, TOTAL_RECORDS)} / ${TOTAL_RECORDS}`);
        }
        console.log(" 10 Lakh DeliveryPostcodePrefix inserted");
        console.timeEnd("Seeder Time");
        process.exit(0);
    }
    catch (error) {
        console.log(" Seeder Error:", error);
        process.exit(1);
    }
};
const start = async () => {
    await connectDB();
    await seed();
};
start();
