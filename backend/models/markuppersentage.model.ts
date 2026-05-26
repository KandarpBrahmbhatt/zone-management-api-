import mongoose, {
    Schema,
    Document
} from "mongoose";

export interface IDeliveryMarkupPercentage extends Document {
    zonePriceId: mongoose.Types.ObjectId;
    markupPercentage: number;
    description?: string;
    status: boolean;
}

const deliveryMarkupPercentageSchema = new Schema<IDeliveryMarkupPercentage>(
    {
        zonePriceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeliveryZonePrice",
            required: true,
        },

        markupPercentage: {
            type: Number, 
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

export default mongoose.model<IDeliveryMarkupPercentage>(
    "DeliveryMarkupPercentage",
    deliveryMarkupPercentageSchema
);