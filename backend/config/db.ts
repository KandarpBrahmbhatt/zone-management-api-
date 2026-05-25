import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectdb = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in .env");
    }

    await mongoose.connect(mongoUrl);

    console.log("MongoDB is connected");
  } catch (error) {
    console.log("MongoDB connection error", error);

    process.exit(1);
  }
};

export default connectdb;