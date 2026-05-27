"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneListing = exports.zonesAggregation = void 0;
const zon_model_1 = __importDefault(require("../models/zon.model"));
const zonesAggregation = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const zoneName = req.query.zoneName;
        const zoneCode = req.query.zoneCode;
        const status = req.query.status;
        // Dynamic filter object
        let matchStage = {};
        // Zone Name Filter
        if (zoneName) {
            matchStage.zoneName = { $regex: zoneName, $options: "i", };
        }
        // Zone Code Filter
        if (zoneCode) {
            matchStage.zoneCode = { $regex: zoneCode, $options: "i", };
        }
        // Status Filter
        if (status !== undefined) {
            matchStage.status = status === "true";
        }
        const zones = await zon_model_1.default.aggregate([
            {
                $match: matchStage,
            },
            // Country Lookup
            {
                $lookup: {
                    from: "countries", //jena jode join karvanu hoy ae lakhiyu 6e.
                    localField: "countryId",
                    foreignField: "_id",
                    as: "country",
                },
            },
            {
                $unwind: {
                    path: "$country",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Postcode Prefix Lookup
            {
                $lookup: {
                    from: "deliverypostcodeprefixes",
                    localField: "postcodePrefixId",
                    foreignField: "_id",
                    as: "postcodePrefix",
                },
            },
            {
                $unwind: {
                    path: "$postcodePrefix",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Zone Price Lookup
            {
                $lookup: {
                    from: "deliveryzoneprices",
                    localField: "zonePriceId",
                    foreignField: "_id",
                    as: "zonePrice",
                },
            },
            {
                $unwind: {
                    path: "$zonePrice",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Markup Lookup
            {
                $lookup: {
                    from: "deliverymarkuppercentages",
                    localField: "markupId",
                    foreignField: "_id",
                    as: "markup",
                },
            },
            {
                $unwind: {
                    path: "$markup",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Select fields
            {
                $project: {
                    _id: 1,
                    zoneName: 1,
                    zoneCode: 1,
                    waterValue: 1,
                    markupValue: 1,
                    increasePercentage: 1,
                    description: 1,
                    status: 1,
                    createdAt: 1,
                    country: {
                        _id: "$country._id",
                        name: "$country.name",
                    },
                    postcodePrefix: {
                        _id: "$postcodePrefix._id",
                        prefix: "$postcodePrefix.prefix",
                    },
                    zonePrice: {
                        _id: "$zonePrice._id",
                        price: "$zonePrice.price",
                    },
                    markup: {
                        _id: "$markup._id",
                        percentage: "$markup.percentage",
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalCount: [
                        {
                            $count: "count",
                        },
                    ],
                },
            },
        ]);
        console.log(zones);
        const total = zones[0].totalCount[0]?.count || 0;
        console.log(total);
        return res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: zones[0].data,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch zones",
            error: error.message,
        });
    }
};
exports.zonesAggregation = zonesAggregation;
const ZoneListing = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const zoneName = req.query.zoneName;
        const zoneCode = req.query.zoneCode;
        const status = req.query.status;
        const matchStage = {};
        if (zoneName) {
            matchStage.zoneName = { $regex: zoneName, $options: "i", };
        }
        if (zoneCode) {
            matchStage.zoneCode = { $regex: zoneCode, $options: "i" };
        }
        const zones = await zon_model_1.default.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "countries", //jena jode join karvanu hoy ae lakhiyu 6e.
                    localField: "countryId",
                    foreignField: "_id",
                    as: "country",
                },
            },
            {
                $unwind: {
                    path: "$country",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "postcodePrefixs",
                    localField: "postcodePrefixId",
                    foreignField: "_id",
                    as: "postcodePrefixId"
                }
            },
            {
                $unwind: {
                    path: "$postcodePrefixId",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "zonePrices",
                    localField: "zonePriceId",
                    foreignField: "_id",
                    as: "zonePriceId"
                }
            },
            {
                $unwind: {
                    path: "$zonePriceId",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "markups",
                    localField: "markupId",
                    foreignField: "_id",
                    as: "markupId"
                }
            },
            {
                $unwind: {
                    path: "$markupId",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Select fields
            {
                $project: {
                    _id: 1,
                    zoneName: 1,
                    zoneCode: 1,
                    waterValue: 1,
                    markupValue: 1,
                    increasePercentage: 1,
                    description: 1,
                    status: 1,
                    createdAt: 1,
                    country: {
                        _id: "$country._id",
                        name: "$country.name",
                    },
                    postcodePrefix: {
                        _id: "$postcodePrefix._id",
                        prefix: "$postcodePrefix.prefix",
                    },
                    zonePrice: {
                        _id: "$zonePrice._id",
                        price: "$zonePrice.price",
                    },
                    markup: {
                        _id: "$markup._id",
                        percentage: "$markup.percentage",
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalCount: [
                        {
                            $count: "count",
                        },
                    ],
                },
            },
        ]);
        console.log(zones);
        const total = zones[0].totalCount[0]?.count || 0;
        console.log(total);
        return res.status(200).json({
            mesage: "ZoneListing api getting sucessfully",
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: zones[0].data,
        });
    }
    catch (error) {
        console.log("ZoneListing error");
        return res.status(500).json({ message: "ZonListing error", error });
    }
};
exports.ZoneListing = ZoneListing;
