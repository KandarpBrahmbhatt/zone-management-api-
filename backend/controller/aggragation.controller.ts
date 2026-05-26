import redis from "../config/redis"
import { Request, Response } from "express";
import zonModel from "../models/zon.model";

export const getZoneAnalytics = async(req:Request,res:Response)=>{
    try {
        const cacheKey = "zone:analytics"

        const cached = await redis.get(cacheKey)
        
        if (cached) {
            console.log("cache hit");
              return res.status(200).json({
                success: true,
                source: "redis",
                data: JSON.parse(cached),
            });
        }
    
        console.log("chache miss")


        const analysis = await zonModel.aggregate([
            
        ])

    } catch (error) {
        console.log("getZonAnalytics error",error)
    }
}