// import mongoose, { Schema, Document } from "mongoose";
// import { IZone } from "../interfaces/zon.interface";

// export interface IZoneDocument extends IZone, Document {}

// const zoneSchema = new Schema<IZoneDocument>(
//   {
//     zoneName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     prefix: {
//       type: String,
//       required: true,
//       // unique: true,
//       // uppercase: true,
//       // trim: true,
//     },

//     zoneCode: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     waterValue: {
//       type: Number,
//       required: true,
//       default: 0,
//     },

//     markupValue: {
//       type: Number,
//       required: true,
//       default: 0,
//     },

//     increasePercentage: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0,
//       max: 100,
//     },

//     description: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     status: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );

// const Zone = mongoose.model<IZoneDocument>(
//   "Zone",
//   zoneSchema
// );

// export default Zone;


import mongoose, { Schema, Document } from "mongoose";

export interface IZoneDocument extends Document {
  zoneName: string;
  zoneCode: string;
  prefix: string;
  waterValue: number;
  markupValue: number;
  increasePercentage: number;
  description?: string;
  status: boolean;
}

const zoneSchema = new Schema<IZoneDocument>(
  {
    zoneName: {
      type: String,
      required: true,
    },

    zoneCode: {
      type: String,
      required: true,
      unique: true,
    },

    prefix: {
      type: String,
      required: true,
    },

    waterValue: {
      type: Number,
      default: 0,
    },

    markupValue: {
      type: Number,
      default: 0,
    },

    increasePercentage: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
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

export default mongoose.model<IZoneDocument>("Zone", zoneSchema);