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

export const deleteListing = async(req,res) =>{
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return res.status(404).json({message:'Listing not found'})
    }

    if (listing.userRef.toString() !== req.user.id){
        return res.status(400).json({message:'You can delete your own listing'})
    }
    try {
        await Listing.findByIdAndDelete(req.params.id)
        return res.status(200).json({message:'Listing deleted Successfully'})
    } catch (error) {
        return res.status(400).json({message:'Server Error'})
    }
}

export const updateListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.userRef.toString() !== req.user.id) {
      return res.status(400).json({ message: 'You can only update your own listing' });
    }
    
    let updateData = { ...req.body };
    if (Array.isArray(updateData.userRef)) {
      updateData.userRef = updateData.userRef[0];
    }
  
    if (req.files && req.files.image) {
      const allowedFormats = ['image/jpg', 'image/jpeg', 'image/png'];
      if (!allowedFormats.includes(req.files.image.mimetype)) {
        return res.status(400).json({ message: "Invalid photo format" });
      }
      const cloudinaryResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath);
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return res.status(500).json({ message: "Image upload failed during update" });
      }
      updateData.image = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      };
    } else if (req.body.existingImage) {
      updateData.image = req.body.existingImage;
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      return res.status(200).json(updatedListing);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Listing not updated' });
    }
  };
  
  

export const getListings = async(req,res) =>{
    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing){
            return res.status(404).json({message:'Listing not found'})
        }
        return res.status(200).json(listing)
    } catch (error) {
        return res.status(400).json({message:'listing error'})
    }
}