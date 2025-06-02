import express from "express";
import { addStation, listStations, removeStation,updateStation } from "../controllers/stationController.js";

const stationRouter = express.Router();

// Add a charging station
stationRouter.post("/add", addStation);

// List all charging stations
stationRouter.get("/list", listStations);

// Remove a charging station
stationRouter.delete("/remove/:id", removeStation);

stationRouter.put("/update/:id",updateStation)

export default stationRouter;