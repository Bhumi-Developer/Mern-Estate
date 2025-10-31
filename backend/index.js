import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoute from './routes/auth.routes.js'
import userRoute from './routes/user.routes.js'
import listingRoute from './routes/listing.routes.js'
import {v2 as cloudinary} from 'cloudinary'
import fileUpload from "express-fileupload";
const app = express()
dotenv.config()
connectDB()
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"]
  }));
app.use((err,req,res,next)=>{
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));
const port = process.env.PORT

app.use('/api/auth',authRoute)
app.use('/api/user',userRoute)
app.use('/api/listing',listingRoute)

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

app.listen(port,()=>{
    console.log(`Server running on Port:${port}`)
})