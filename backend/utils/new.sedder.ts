// import mongoose from "mongoose";
// import dotenv from "dotenv";

// import Country from "../models/country.model";
// import DeliveryPostcodePrefix from "../models/deliveryPostCodePrifix.model";

// import DeliveryZonePrice from "../models/deliveryZonePrice.model";

// import DeliveryMarkupPercentage from "../models/markuppersentage.model";

// dotenv.config();

// const seedDatabase = async () => {
//     try {
//         await mongoose.connect("mongodb://localhost:27017/zon-project");
//         console.log("MongoDB Connected");

//         // clear old data
//         await Country.deleteMany();
//         await DeliveryPostcodePrefix.deleteMany();
//         await DeliveryZonePrice.deleteMany();
//         await DeliveryMarkupPercentage.deleteMany();

//         console.log("Old Data Deleted");

//         // countries 
//         const countries = await Country.insertMany([
//             {
//                 countryName: "India",
//                 countryCode: "IN",
//                 currency: "INR",
//             },
//             {
//                 countryName: "USA",
//                 countryCode: "US",
//                 currency: "USD",
//             },
//             {
//                 countryName: "UK",
//                 countryCode: "GB",
//                 currency: "GBP",
//             },
//         ]);

//         console.log("Countries Seeded");

//         const prefixes: any[] = [];

//         for (const country of countries) {
//             for (let i = 100; i < 120; i++) {

//                 prefixes.push(
//                     {
//                         countryId: country._id,
//                         prefix: `${i}`,
//                         description: `${country.countryName}
//                         Prefix ${i}`,
//                     });
//             }
//         }

//         const insertedPrefixes =
//             await DeliveryPostcodePrefix.insertMany(prefixes);

//         console.log("Prefixes Seeded");

//         const prices: any[] = [];

//         for (const prefix of insertedPrefixes) {
//             prices.push({
//                 postcodePrefixId: prefix._id,
//                 minWeight: 0,
//                 maxWeight: 1,
//                 basePrice: 100,
//             });

//             prices.push({
//                 postcodePrefixId: prefix._id,
//                 minWeight: 1,
//                 maxWeight: 5,
//                 basePrice: 200,
//             });
//         }

//         const insertedPrices = await DeliveryZonePrice.insertMany(prices);

//         console.log("Prices Seeded");

//         const markups: any[] = [];

//         for (const price of insertedPrices) {

//             markups.push({
//                 zonePriceId: price._id,

//                 markupPercentage: Math.floor(Math.random() * 20) + 5,

//                 description: "Shipping Markup",
//             });
//         }

//         await DeliveryMarkupPercentage.insertMany(markups);

//         console.log("Markup Seeded");

//         console.log("Database Seeded Successfully");

//         process.exit(0);

//     } catch (error) {

//         console.log(error);

//         process.exit(1);
//     }
// };

// seedDatabase();


import mongoose from "mongoose";
import dotenv from "dotenv";

import Country from "../models/country.model";
import DeliveryPostcodePrefix from "../models/deliveryPostCodePrifix.model";
import DeliveryZonePrice from "../models/deliveryZonePrice.model";
import DeliveryMarkupPercentage from "../models/markuppersentage.model"

dotenv.config();

const TOTAL_COUNTRIES = 14000;
const PREFIX_PER_COUNTRY = 10;
const BATCH_SIZE = 1000;

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/zon-project");
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("MongoDB Connection Error",error);
        process.exit(1);
    }
};

//  Generate Countries 
const generateCountryData = (startIndex: number,batchSize: number) => {
    const countries = [];

    for (let i = startIndex;i < startIndex + batchSize;i++) {
        countries.push({countryName: `Country ${i + 1}`,
            countryCode: `C${String(i + 1).padStart(5, "0")}`,
            currency: `CUR${i + 1}`,
            status: Math.random() > 0.2,
        });
    }

    return countries;
};

// -seeder
const seedDatabase = async () => {
    try {
        console.time("Seeder Finished");
        // Clear old data
        await DeliveryMarkupPercentage.deleteMany();
        await DeliveryZonePrice.deleteMany();
        await DeliveryPostcodePrefix.deleteMany();
        await Country.deleteMany();

        console.log("Old Data Deleted");

        let globalPrefixCounter = 100000;

        // Country batches
        for (  let i = 0;i < TOTAL_COUNTRIES;i += BATCH_SIZE
        ) {
            const countryData =generateCountryData(i,BATCH_SIZE);

            const countries =await Country.insertMany(countryData,{ordered: false,});

            console.log(`Countries Inserted:${Math.min(i + BATCH_SIZE,TOTAL_COUNTRIES)}/${TOTAL_COUNTRIES}`);

            // Prefix data
            const prefixData = [];

            for (const country of countries) {
                for (let j = 0;j < PREFIX_PER_COUNTRY;j++) {
                    prefixData.push({
                        countryId:country._id,
                        // unique prefix
                        prefix: String(globalPrefixCounter++),
                        description:`${country.countryName}Delivery Prefix`,
                        status: true,
                    });
                }
            }

            const prefixes =await DeliveryPostcodePrefix.insertMany(
                    prefixData,
                    {
                        ordered: false,
                    }
                );

            console.log(`${prefixes.length}Prefixes Inserted`);

            const zonePriceData = [];

            for (const prefix of prefixes) {
                zonePriceData.push({
                    postcodePrefixId:prefix._id,
                    minWeight: 0,
                    maxWeight: 1,
                    basePrice:Math.floor(Math.random() *100) + 100,
                    status: true,
                });

                zonePriceData.push({
                    postcodePrefixId:prefix._id,
                    minWeight: 1,
                    maxWeight: 5,
                    basePrice:Math.floor(Math.random() *200) + 200,
                    status: true,
                });

                zonePriceData.push({
                    postcodePrefixId:prefix._id,
                    minWeight: 5,
                    maxWeight: 10,
                    basePrice:Math.floor(Math.random() *300) + 400,
                    status: true,
                });
            }

            const prices =await DeliveryZonePrice.insertMany(zonePriceData,
                    {
                        ordered: false,
                    }
                );

            console.log(`${prices.length}Zone Prices Inserted`);

            // markupdata
            const markupData = [];

            for (const price of prices) {
                markupData.push({
                    zonePriceId:price._id,

                    markupPercentage:Math.floor(Math.random() *20) + 5,

                    description:"Shipping Markup",

                    status: true,
                });
            }

            await DeliveryMarkupPercentage.insertMany(
                markupData,
                {
                    ordered: false,
                }
            );

            console.log(`${markupData.length}Markups Inserted`);
        }

        console.log("Database Seeded Successfully");

        console.timeEnd("Seeder Finished");

        process.exit(0);
    } catch (error) {
        console.log("Seeder Error:",error);
        process.exit(1);
    }
};

// Run Seeder
connectDB().then(() => {
    seedDatabase();
});