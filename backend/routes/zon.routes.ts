import express from "express";
import { createZon, getAllZone } from "../controller/zon.controller";

const zonRouter = express.Router();

zonRouter.post("/create", createZon);
zonRouter.get("/get",getAllZone)
export default zonRouter;