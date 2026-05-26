import { Request, Response } from "express";
import Zone from "../models/zon.model";
import redis from "../config/redis";


//create zon

export const createZon = async (req: Request, res: Response) => {
    try {
        const {
            zoneName,
            prefix,
            zoneCode,
            waterValue,
            markupValue,
            increasePercentage,
            description,
            status
        } = req.body;

        console.log(req.body);


        const existingprefix = await Zone.findOne({ prefix })

        if (existingprefix) {
            return res.status(400).json({ message: "prifix already existing" })
        }

        const existingzoneCode = await Zone.findOne({ zoneCode })
        if (existingzoneCode) {
            return res.status(400).json({ message: "zoncode alreday existing" })
        }
        const zon = await Zone.create({
            zoneName,
            prefix,
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
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Zone creation error",
            error
        });
    }
};

export const getAllZone = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // convert query params to string
        const search = req.query.search?.toString().trim() || "";
        const status = req.query.status?.toString();

        // cache key
        const cacheKey = `getAllZone:${page}:${limit}:${search}:${status}`;

        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("cache hit");
            return res.status(200).json({ message: "Redis cache", source: "redis", ...JSON.parse(cached), });
        }

        console.log("cache miss");

        let filter: any = {};

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
                    prefix: {
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
        const zone = await Zone.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Total count
        const total = await Zone.countDocuments(filter);
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
        await redis.set(cacheKey, JSON.stringify(results), "EX", 60);

        return res.status(200).json({
            message: "Get all zone successfully",
            success: true,
            source: "database",
            ...results,
        });

    } catch (error) {
        console.log("getAllZone error", error);

        return res.status(500).json({
            message: "getAllZone error",
            success: false,
            error,
        });
    }
};


export const updateZone = async (req: Request, res: Response) => {
    try {
        const updatedZone = await Zone.findByIdAndUpdate(
            req.params.id,
            req.body
        )
        if (!updatedZone) {
            return res.status(400).json({ message: "UpdatedZone not found" })
        }

        return res.status(200).json({ message: "UpdatedZone found sucessfully", updatedZone })
    } catch (error) {
        console.log("updateZon error", error)
        return res.status(500).json({ message: "updatedZon error", error })
    }
}

export const getSingleZone = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const gettingSingleZone = await Zone.findById(id)

        if (!gettingSingleZone) {
            return res.status(400).json({ message: "Gettign singlezone not found" })
        }
        return res.status(200).json({ message: "getting singleZone sucessfully", gettingSingleZone })
    } catch (error) {
        console.log("getSingleZone error")
        return res.status(500).json({ message: "getting singleZone error", error })
    }
}


export const deletedZone = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const deletedZon = await Zone.findByIdAndUpdate(id)
        if (!deletedZon) {
            return res.status(400).json({ message: "id not found" })
        }

        return res.status(200).json({ message: "deletedZon sucessfully", deletedZon })
    } catch (error) {
        console.log("deletedZon sucessfully", error)
    }
}


export const getZoneAnalytics = async (
    req: Request,
    res: Response
) => {
    try {
        const cacheKey = "zone:analytics";

        // Redis cache check
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("cache hit");

            return res.status(200).json({
                success: true,
                source: "redis",
                data: JSON.parse(cached),
            });
        }

        console.log("cache miss");

        const analytics = await Zone.aggregate([
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
                                    $avg:
                                        "$increasePercentage",
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
        await redis.set(
            cacheKey,
            JSON.stringify(result),
            "EX",
            60
        );

        return res.status(200).json({
            success: true,
            source: "database",
            data: result,
        });

    } catch (error) {
        console.log(
            "getZoneAnalytics error",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Zone analytics error",
            error,
        });
    }
};


import Country from "../models/country.model";

export const getAllZoneData = async () => {
  try {
    const data = await Country.aggregate([
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

          prefix:
            "$postcodePrefixes.prefix",

          description:
            "$postcodePrefixes.description",

          minWeight:
            "$zonePrices.minWeight",

          maxWeight:
            "$zonePrices.maxWeight",

          basePrice:
            "$zonePrices.basePrice",

          markupPercentage:
            "$markup.markupPercentage",

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
  } catch (error) {
    console.log(error);
  }
};