import Listing from "../models/listing.model.js"

export const create = async(req,res)=>{
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        return res.status(500).json({message:"Listing not created"})
    }
}