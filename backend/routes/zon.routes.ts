import express from "express";
import { createZon, deletedZone, getAllZone, getAllZoneData, getSingleZone, getZoneAnalytics, updateZone } from "../controller/zon.controller";

const zonRouter = express.Router();

zonRouter.post("/create", createZon);
zonRouter.get("/get",getAllZone)
zonRouter.put("/update/:id",updateZone)
zonRouter.get("/get/:id",getSingleZone)
zonRouter.delete("/delete/:id",deletedZone)
zonRouter.get("/analytics",getZoneAnalytics)
zonRouter.get("/getAllZoneData",getAllZoneData)
export default zonRouter;