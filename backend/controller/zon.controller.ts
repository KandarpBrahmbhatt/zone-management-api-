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
        const limit = Number(req.query.limit) || 10

        const skip = (page - 1) * limit

        // const search = req.query.search?.toString() || ""
        // const status = req.query.status?.toString()
        const { search, status } = req.query

        const cacheKey = `getAllZon:${search}:${status}`;
        const catched = await redis.get(cacheKey)
        if (catched) {
            console.log("catchHit")
            return res.status(200).json({ message: "redis cached", source: "redis", ...JSON.parse(catched) })
        }

        console.log("redis miss")

        let filter: any = {};

        if (search) {
            filter.$or = [
                {
                    zoneName: {
                        $regex: search,
                        $options: "i"
                    }
                }, {
                    prefix: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        }
        // filter status
        if (status !== undefined) {
            filter.status = status === "true"
        }

        const zone = await Zone.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // total count show karvamate
        const total = await Zone.countDocuments(filter)
        const totalPages = Math.ceil(total / limit);

        const results = {
            zone, pagination: { totalPages, page, limit, total }
        }
        
        await redis.set(cacheKey, JSON.stringify(results), "EX", 60)
        return res.status(200).json({ message: "getAllZon sucessfully", success: true, source: "database", ...results })



        // res.json({ success: true, count: data.length, source: "database", ...results });


    } catch (error) {
        console.log("getAllZon error")
        return res.status(500).json({ message: "getAllZon error", error })
    }
}


export const getSingleZone = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        console.log("getSingleZone error")
    }
}