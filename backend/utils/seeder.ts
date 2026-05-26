// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Zone from "../models/zon.model";
// import connectdb from "../config/db";

// dotenv.config();

// const TOTAL_RECORDS = 1000000; // 10 lakh
// const BATCH_SIZE = 10000;

// const connectDB = async () => {
//   try {
//   mongoose.connect("mongodb://localhost:27017/zon-project")
//     console.log(
//       "MongoDB Connected Successfully"
//     );
//   } catch (error) {
//     console.log(
//       "MongoDB Connection Error",
//       error
//     );
//     process.exit(1);
//   }
// };

// const generateZoneData = (startIndex: number, batchSize: number) => {
//   const zones = [];

//   for (let i = startIndex; i < startIndex + batchSize; i++) {
//     zones.push({
//       zoneName: `Zone ${i + 1}`,
//       prefix: `ZN${i + 1}`, // unique
//       zoneCode: `ZONE${i + 1}`,
//       waterValue:
//         Math.floor(Math.random() * 500) + 50,
//       markupValue:
//         Math.floor(Math.random() * 100) + 1,
//       increasePercentage:
//         Math.floor(Math.random() * 50) + 1,
//       description: `Zone ${
//         i + 1
//       } description`,
//       status: Math.random() > 0.5,
//     });
//   }

//   return zones;
// };

// const seedZones = async () => {
//   try {
//     console.time("Seeder Finished");

//     for (let i = 0;i < TOTAL_RECORDS;i += BATCH_SIZE) {
//       const zoneData =generateZoneData(i,BATCH_SIZE);

//       await Zone.insertMany(
//         zoneData,
//         {
//           ordered: false,
//         }
//       );

//       console.log(
//         `Inserted ${
//           Math.min(
//             i + BATCH_SIZE,
//             TOTAL_RECORDS
//           )
//         } / ${TOTAL_RECORDS}`
//       );
//     }

//     console.log(
//       "10 Lakh Zone Data Inserted Successfully"
//     );

//     console.timeEnd(
//       "Seeder Finished"
//     );

//     process.exit(0);
//   } catch (error) {
//     console.log(
//       "Seeder Error:",
//       error
//     );
//     process.exit(1);
//   }
// };

// connectDB().then(() => {
//   seedZones();
// });



import mongoose from "mongoose";
import dotenv from "dotenv";
import Zone from "../models/zon.model";

dotenv.config();

const TOTAL_RECORDS = 1000000; // 10 lakh
const BATCH_SIZE = 10000;

// CONNECT DB
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
const generateZoneData = (start: number, size: number) => {
  const data = [];

  for (let i = start; i < start + size; i++) {
    data.push({
      zoneName: `Zone ${i + 1}`,
      zoneCode: `ZONE_${i + 1}`, // UNIQUE SAFE
      prefix: `PR_${(i % 1000) + 1}`,

      waterValue: Math.floor(Math.random() * 500),
      markupValue: Math.floor(Math.random() * 100),
      increasePercentage: Math.floor(Math.random() * 50),

      description: `Zone description ${i + 1}`,
      status: Math.random() > 0.3,
    });
  }

  return data;
};

// SEED FUNCTION
const seedZones = async () => {
  try {
    console.time("Zone Seeder");

    await Zone.deleteMany();

    for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
      const batch = generateZoneData(i, BATCH_SIZE);

      await Zone.insertMany(batch, {
        ordered: false,
      });

      console.log(
        `Inserted ${Math.min(i + BATCH_SIZE, TOTAL_RECORDS)} / ${TOTAL_RECORDS}`
      );
    }

    console.log(" 10 Lakh Zones Inserted Successfully");
    console.timeEnd("Zone Seeder");

    process.exit(0);
  } catch (error) {
    console.log(" Seeder Error:", error);
    process.exit(1);
  }
};

// RUN
const start = async () => {
  await connectDB();
  await seedZones();
};

start();