import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'

export const isAuthenticated = async(req,res,next) =>{
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({message:"User is not authenticated"})
        }
        const decode = await jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decode.userId)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"User not authenticated"})
    }
}