// import mongoose, { Schema, Document } from "mongoose";

// export interface IDeliveryZonePrice extends Document {
//   price: number;
//   currency: string;
//   status: boolean;
// }

// const deliveryZonePriceSchema =
//   new Schema<IDeliveryZonePrice>(
//     {
//       price: {
//         type: Number,
//         required: true,
//       },

//       currency: {
//         type: String,
//         default: "INR",
//       },

//       status: {
//         type: Boolean,
//         default: true,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// export default mongoose.model<IDeliveryZonePrice>(
//   "DeliveryZonePrice",
//   deliveryZonePriceSchema
// );


import mongoose, { Schema, Document } from "mongoose";

export interface IDeliveryZonePrice extends Document {
  postcodePrefixId: mongoose.Types.ObjectId;
  minWeight: number;
  maxWeight: number;
  basePrice: number;
  status: boolean;
}

const deliveryZonePriceSchema = new Schema<IDeliveryZonePrice>(
  {
    postcodePrefixId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPostcodePrefix",
      required: true,
      index: true,
    },

    minWeight: {
      type: Number,
      required: true,
    },

    maxWeight: {
      type: Number,
      required: true,
    },

    basePrice: {
      type: Number,
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDeliveryZonePrice>(
  "DeliveryZonePrice",
  deliveryZonePriceSchema
);