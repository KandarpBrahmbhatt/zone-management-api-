"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zon_routes_1 = __importDefault(require("./routes/zon.routes"));
const db_1 = __importDefault(require("./config/db"));
const zone_cron_1 = require("./cron/zone.cron");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/zone", zon_routes_1.default);
(0, zone_cron_1.startZoneCron)();
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    (0, db_1.default)();
});
