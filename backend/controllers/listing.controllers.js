import Listing from "../models/listing.model.js"
import { v2 as cloudinary } from "cloudinary";

export const create = async(req,res)=>{
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "photo is required" });
        }
        const { image } = req.files;
        const allowedFormats = ['image/jpg', 'image/jpeg', 'image/png'];
        if (!allowedFormats.includes(image.mimetype)) {
            return res.status(400).json({ message: "Invalid photo format" });
        }
        const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
    
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return res.status(500).json({ message: "Image upload failed" });
        }
        const listingData = {
            ...req.body,
            userRef: req.user?._id || req.body.userRef,
            image: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.url,
            }
        }
        const listing = await Listing.create(listingData)
        return res.status(201).json(listing)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Listing not created"})
    }
}