import express from "express";
import zonRouter from "./routes/zon.routes";
import connectdb from "./config/db";

const app = express(); 

app.use(express.json());

app.use("/api/zone", zonRouter);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectdb()
});