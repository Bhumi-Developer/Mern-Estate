import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const generateToken = async(userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'7d'
    })
      res.cookie("jwt",token,{
        httpOnly: true,
        secure: false,
    })
    await User.findByIdAndUpdate(userId,{token})
    return token;
}