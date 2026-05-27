"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newData = exports.getAllZoneData = exports.getZoneAnalytics = exports.deletedZone = exports.getSingleZone = exports.updateZone = exports.getAllZone = exports.createZon = void 0;
const zon_model_1 = __importDefault(require("../models/zon.model"));
const redis_1 = __importDefault(require("../config/redis"));
//create zon
const createZon = async (req, res) => {
    try {
        const { zoneName, postcodePrefixId, zoneCode, waterValue, markupValue, increasePercentage, description, status } = req.body;
        console.log(req.body);
        const existingprefix = await zon_model_1.default.findOne({ postcodePrefixId });
        if (existingprefix) {
            return res.status(400).json({ message: "prifix already existing" });
        }
        const existingzoneCode = await zon_model_1.default.findOne({ zoneCode });
        if (existingzoneCode) {
            return res.status(400).json({ message: "zoncode alreday existing" });
        }
        const zon = await zon_model_1.default.create({
            zoneName,
            postcodePrefixId,
            zoneCode,
            waterValue,
            markupValue,
            increasePercentage,
            description,
            status
        });
        return res.status(201).json({
            message: "Zone created successfully",
            zon,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Zone creation error",
            error
        });
    }
};
exports.createZon = createZon;
const getAllZone = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // convert query params to string
        const search = req.query.search?.toString().trim() || "";
        const status = req.query.status?.toString();
        // cache key
        const cacheKey = `getAllZone:${page}:${limit}:${search}:${status}`;
        const cached = await redis_1.default.get(cacheKey);
        if (cached) {
            console.log("cache hit");
            return res.status(200).json({ message: "Redis cache", source: "redis", ...JSON.parse(cached), });
        }
        console.log("cache miss");
        let filter = {};
        // Search filtering
        if (search) {
            filter.$or = [
                {
                    zoneName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    postcodePrefixId: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
        // Status filtering
        if (status !== undefined && status !== "") {
            filter.status = status === "true";
        }
        // Get data
        const zone = await zon_model_1.default.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        // Total count
        const total = await zon_model_1.default.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const results = {
            zone,
            pagination: {
                total,
                totalPages,
                page,
                limit,
            },
        };
        // save in redis
        await redis_1.default.set(cacheKey, JSON.stringify(results), "EX", 60);
        return res.status(200).json({
            message: "Get all zone successfully",
            success: true,
            source: "database",
            ...results,
        });
    }
    catch (error) {
        console.log("getAllZone error", error);
        return res.status(500).json({
            message: "getAllZone error",
            success: false,
            error,
        });
    }
};
exports.getAllZone = getAllZone;
const updateZone = async (req, res) => {
    try {
        const updatedZone = await zon_model_1.default.findByIdAndUpdate(req.params.id, req.body);
        if (!updatedZone) {
            return res.status(400).json({ message: "UpdatedZone not found" });
        }
        return res.status(200).json({ message: "UpdatedZone found sucessfully", updatedZone });
    }
    catch (error) {
        console.log("updateZon error", error);
        return res.status(500).json({ message: "updatedZon error", error });
    }
};
exports.updateZone = updateZone;
const getSingleZone = async (req, res) => {
    try {
        const { id } = req.params;
        const gettingSingleZone = await zon_model_1.default.findById(id);
        if (!gettingSingleZone) {
            return res.status(400).json({ message: "Gettign singlezone not found" });
        }
        return res.status(200).json({ message: "getting singleZone sucessfully", gettingSingleZone });
    }
    catch (error) {
        console.log("getSingleZone error");
        return res.status(500).json({ message: "getting singleZone error", error });
    }
};
exports.getSingleZone = getSingleZone;
const deletedZone = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedZon = await zon_model_1.default.findByIdAndUpdate(id);
        if (!deletedZon) {
            return res.status(400).json({ message: "id not found" });
        }
        return res.status(200).json({ message: "deletedZon sucessfully", deletedZon });
    }
    catch (error) {
        console.log("deletedZon sucessfully", error);
    }
};
exports.deletedZone = deletedZone;
const getZoneAnalytics = async (req, res) => {
    try {
        const cacheKey = "zone:analytics";
        // Redis cache check
        const cached = await redis_1.default.get(cacheKey);
        if (cached) {
            console.log("cache hit");
            return res.status(200).json({
                success: true,
                source: "redis",
                data: JSON.parse(cached),
            });
        }
        console.log("cache miss");
        const analytics = await zon_model_1.default.aggregate([
            {
                $facet: {
                    // Total stats
                    totalStats: [
                        {
                            $group: {
                                _id: null,
                                totalZones: { $sum: 1 },
                                activeZones: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", true] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                                inactiveZones: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", false] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                                avgWaterValue: {
                                    $avg: "$waterValue",
                                },
                                avgMarkupValue: {
                                    $avg: "$markupValue",
                                },
                                avgIncreasePercentage: {
                                    $avg: "$increasePercentage",
                                },
                            },
                        },
                    ],
                    // Prefix wise stats
                    prefixStats: [
                        {
                            $group: {
                                _id: "$prefix",
                                totalZones: {
                                    $sum: 1,
                                },
                                avgWaterValue: {
                                    $avg: "$waterValue",
                                },
                            },
                        },
                        {
                            $sort: {
                                totalZones: -1,
                            },
                        },
                        {
                            $limit: 10,
                        },
                    ],
                    // Price analysis
                    priceAnalytics: [
                        {
                            $group: {
                                _id: null,
                                maxWaterValue: {
                                    $max: "$waterValue",
                                },
                                minWaterValue: {
                                    $min: "$waterValue",
                                },
                                avgWaterValue: {
                                    $avg: "$waterValue",
                                },
                                maxMarkupValue: {
                                    $max: "$markupValue",
                                },
                                minMarkupValue: {
                                    $min: "$markupValue",
                                },
                                avgMarkupValue: {
                                    $avg: "$markupValue",
                                },
                            },
                        },
                    ],
                },
            },
        ]);
        const result = analytics[0];
        // Save Redis cache
        await redis_1.default.set(cacheKey, JSON.stringify(result), "EX", 60);
        return res.status(200).json({
            success: true,
            source: "database",
            data: result,
        });
    }
    catch (error) {
        console.log("getZoneAnalytics error", error);
        return res.status(500).json({
            success: false,
            message: "Zone analytics error",
            error,
        });
    }
};
exports.getZoneAnalytics = getZoneAnalytics;
const country_model_1 = __importDefault(require("../models/country.model"));
const zon_model_2 = __importDefault(require("../models/zon.model"));
const getAllZoneData = async () => {
    try {
        const data = await country_model_1.default.aggregate([
            {
                $lookup: {
                    from: "deliverypostcodeprefixes",
                    localField: "_id",
                    foreignField: "countryId",
                    as: "postcodePrefixes",
                },
            },
            {
                $unwind: "$postcodePrefixes",
            },
            {
                $lookup: {
                    from: "deliveryzoneprices",
                    localField: "postcodePrefixes._id",
                    foreignField: "postcodePrefixId",
                    as: "zonePrices",
                },
            },
            {
                $unwind: "$zonePrices",
            },
            {
                $lookup: {
                    from: "deliverymarkuppercentages",
                    localField: "zonePrices._id",
                    foreignField: "zonePriceId",
                    as: "markup",
                },
            },
            {
                $unwind: {
                    path: "$markup",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    countryId: "$_id",
                    countryName: 1,
                    countryCode: 1,
                    currency: 1,
                    prefix: "$postcodePrefixes.prefix",
                    description: "$postcodePrefixes.description",
                    minWeight: "$zonePrices.minWeight",
                    maxWeight: "$zonePrices.maxWeight",
                    basePrice: "$zonePrices.basePrice",
                    markupPercentage: "$markup.markupPercentage",
                    finalPrice: {
                        $add: [
                            "$zonePrices.basePrice",
                            {
                                $multiply: [
                                    "$zonePrices.basePrice",
                                    {
                                        $divide: [
                                            "$markup.markupPercentage",
                                            100,
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        ]);
        return data;
    }
    catch (error) {
        console.log(error);
    }
};
exports.getAllZoneData = getAllZoneData;
//create api to zonename and zone code parthi  prefix value fatch karvani 6e
// export const newData = async (req: Request, res: Response) => {
//   try {
//     const zoneName = req.query.zoneName as string;
//     const zoneCode = req.query.zoneCode as string;
//     if (!zoneName || !zoneCode) {
//       return res.status(400).json({
//         message: "zoneName and zoneCode are required",
//       });
//     }
//     const result = await zonModel.findOne({
//       zoneName,
//       zoneCode,
//     });
//     if (!result) {
//       return res.status(404).json({
//         message: "Zone not found",
//       });
//     }
//     return res.status(200).json({
//       message: "Success",
//       prefix: result.prefix,
//     });
//   } catch (error) {
//     console.log("getValue error", error);
//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };
const newData = async (req, res) => {
    try {
        const zoneName = req.body.zoneName?.trim();
        const zoneCode = req.body.zoneCode?.trim();
        console.log("zoneName:", zoneName);
        console.log("zoneCode:", zoneCode);
        if (!zoneName || !zoneCode) {
            return res.status(400).json({
                message: "zoneName and zoneCode are required",
            });
        }
        const result = await zon_model_2.default.findOne({
            zoneName,
            // zoneCode,
        });
        console.log("result", result);
        if (!result) {
            return res.status(404).json({
                message: "Zone not found",
            });
        }
        return res.status(200).json({
            message: "Success",
            prefix: result.postcodePrefixId,
        });
    }
    catch (error) {
        console.log("error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.newData = newData;
