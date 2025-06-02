import express from 'express'

import { connectDB } from "./config/db.js"
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/UserRoute.js'
import stationRouter from './routes/stationRoute.js'

//app config
dotenv.config()
const app = express();

const port = process.env.PORT || 5000;
//middleware
app.use(express.json()) //front to backend
app.use(cors())//backend to forntend

//db connection
connectDB();

//api endpoints
app.use("/api/user",userRouter)

app.use("/api/station",stationRouter)

app.get("/",(req,res)=>{
    res.send("Api working")
})

//to run server
app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)

})