import stationModel from "../models/stationModel.js";

// Add a new charging station
const addStation = async (req, res) => {
    const { name, latitude, longitude, status, powerOutput, connectorType } = req.body;

    if (!name || !latitude || !longitude || !status || !powerOutput || !connectorType) {
        return res.json({ success: false, message: "All fields are required" });
    }

    const station = new stationModel({
        name,
        location: { latitude, longitude },
        status,
        powerOutput,
        connectorType
    });

    try {
        await station.save();
        res.json({ success: true, message: "Charging Station Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// List all charging stations
const listStations = async (req, res) => {
    try {
        const stations = await stationModel.find({});
        res.json({ success: true, data: stations });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove a charging station



const removeStation = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Station ID is required" });
        }

        const station = await stationModel.findById(id);
        if (!station) {
            return res.status(404).json({ success: false, message: "Station not found" });
        }

        await stationModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Charging Station Removed" });

    } catch (error) {
        console.error("Error deleting station:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


const updateStation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, latitude, longitude, status, powerOutput, connectorType } = req.body;

        if (!id || !name || !latitude || !longitude || !status || !powerOutput || !connectorType) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const updatedStation = await stationModel.findByIdAndUpdate(
            id,
            { name, location: { latitude, longitude }, status, powerOutput, connectorType },
            { new: true }
        );

        if (!updatedStation) {
            return res.status(404).json({ success: false, message: "Station not found" });
        }

        res.status(200).json({ success: true, message: "Charging Station Updated", data: updatedStation });

    } catch (error) {
        console.error("Error updating station:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



export { addStation, listStations, removeStation, updateStation };
