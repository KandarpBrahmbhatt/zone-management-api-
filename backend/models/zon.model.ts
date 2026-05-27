// import mongoose, { Schema, Document } from "mongoose";

// export interface IZoneDocument extends Document {
//   zoneName: string;
//   zoneCode: string;
//   prefix: string;
//   waterValue: number;
//   markupValue: number;
//   increasePercentage: number;
//   description?: string;
//   status: boolean;
// }

// const zoneSchema = new Schema<IZoneDocument>(
//   {
//     zoneName: {
//       type: String,
//       required: true,
//     },

//     zoneCode: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     prefix: {
//       type: String,
//       required: true,
//     },

//     waterValue: {
//       type: Number,
//       default: 0,
//     },

//     markupValue: {
//       type: Number,
//       default: 0,
//     },

//     increasePercentage: {
//       type: Number,
//       default: 0,
//     },

//     description: {
//       type: String,
//       default: "",
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

// export default mongoose.model<IZoneDocument>("Zone", zoneSchema);


import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IZoneDocument
  extends Document {
  zoneName: string;
  zoneCode: string;

  countryId: mongoose.Types.ObjectId;

  postcodePrefixId: mongoose.Types.ObjectId;

  zonePriceId: mongoose.Types.ObjectId;

  markupId: mongoose.Types.ObjectId;

  waterValue: number;
  markupValue: number;
  increasePercentage: number;

  description?: string;
  status: boolean;
  isDeleted: boolean; // ADD 
}

const zoneSchema = new Schema<IZoneDocument>(
    {
      zoneName: {
        type: String,
        required: true,
        trim: true,
      },

      zoneCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      // Country Relation
      countryId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Country",
        required: true,
      },

      // Postcode Prefix Relation
      postcodePrefixId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryPostcodePrefix",
        required: true,
      },

      // Zone Price Relation
      zonePriceId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryZonePrice",
        required: true,
      },

      // Markup Relation
      markupId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryMarkupPercentage",
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
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
      // versionKey: false,
    }
  );

export default mongoose.model<IZoneDocument>(
  "Zone",
  zoneSchema
);