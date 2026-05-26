// import mongoose from 'mongoose';
// import mongoosw,{Schema,Document} from 'mongoose'

// export interface Icountry extends Document {
//     CountryName:string;
//     countryCode:string,
//     status:boolean,
//     phoneCode:string,
//     currency:string
// }

// const contrySchema = new Schema<Icountry>(
//     {
//         CountryName:{
//             type:String,
//             required:true,
//             trim:true
//         },
//         countryCode:{
//             type:String,
//             required:true,
//             unique:true,
//             uppercase:true
//         },
//         status:{
//             type:Boolean
//         },
//         phoneCode:{
//             type:String
//         },
//         currency:{
//             type:String
//         }
//     },
//     {
//         timestamps:true
//     }
// )

// export default mongoose.model<Icountry>("Country",contrySchema)


import mongoose, {
  Schema,
  Document
} from "mongoose";

export interface ICountry
  extends Document {
  countryName: string;
  countryCode: string;
  currency: string;
  status: boolean;
}

const countrySchema =
  new Schema<ICountry>(
    {
      countryName: {
        type: String,
        required: true,
      },

      countryCode: {
        type: String,
        required: true,
        unique: true,
      },

      currency: {
        type: String,
        default: "USD",
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

export default mongoose.model<ICountry>(
  "Country",
  countrySchema
);