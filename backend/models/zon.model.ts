import mongoose, { Schema, Document } from "mongoose";
import { IZone } from "../interfaces/zon.interface";

export interface IZoneDocument extends IZone, Document {}

const zoneSchema = new Schema<IZoneDocument>(
  {
    zoneName: {
      type: String,
      required: true,
      trim: true,
    },

    prefix: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    zoneCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    waterValue: {
      type: Number,
      required: true,
      default: 0,
    },

    markupValue: {
      type: Number,
      required: true,
      default: 0,
    },

    increasePercentage: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Zone = mongoose.model<IZoneDocument>(
  "Zone",
  zoneSchema
);

export default Zone;