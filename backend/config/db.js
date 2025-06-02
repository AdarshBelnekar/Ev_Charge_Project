import mongoose from "mongoose"

export const connectDB =async () =>{
    await mongoose.connect('mongodb+srv://bussinessa144:evcharging0909@cluster.ijn1egh.mongodb.net/ev-charging').then(()=>console.log("Db connect"));
}