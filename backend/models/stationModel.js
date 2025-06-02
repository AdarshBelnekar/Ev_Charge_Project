import mongoose from "mongoose";

const stationSchema =  new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  powerOutput: { type: Number, required: true },
  connectorType: { type: String, required: true }

});
const stationModel = mongoose.models.stations || mongoose.model("stations",stationSchema);

export default stationModel;