// import mongoose, { Schema, Document } from "mongoose";

// export interface IDeliveryPostCodePrefix extends Document {
//   prefix: string;
//   description?: string;
//   status: boolean;
//   countryCode: mongoose.Types.ObjectId;
// }

// const deliveryPostCodePrefixSchema =
//   new Schema<IDeliveryPostCodePrefix>(
//     {
//       prefix: {
//         type: String,
//         required: true,
//         unique: true,
//         uppercase: true,
//         trim: true,
//       },

//       description: {
//         type: String,
//         default: "",
//       },

//       status: {
//         type: Boolean,
//         default: true,
//       },

//       countryCode: {
//         type: Schema.Types.ObjectId,
//         ref: "Country",
//         required: true,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// export default mongoose.model<IDeliveryPostCodePrefix>(
//   "DeliveryPostcodePrefix",
//   deliveryPostCodePrefixSchema
// );



import mongoose, {
  Schema,
  Document
} from "mongoose";

export interface IDeliveryPostcodePrefix extends Document {
  countryId:mongoose.Types.ObjectId;
  prefix: string;
  description?: string;
  status: boolean;
}

const deliveryPostcodePrefixSchema =new Schema<IDeliveryPostcodePrefix>(
  {
    countryId: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    prefix: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

deliveryPostcodePrefixSchema.index({prefix: 1});

export default mongoose.model<IDeliveryPostcodePrefix>(
  "DeliveryPostcodePrefix",
  deliveryPostcodePrefixSchema
);