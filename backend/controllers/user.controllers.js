import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import { generateToken } from "../config/token.js"

export const updateUser = async(req,res) =>{
    const {id} = req.params
       try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid user Id'})
        }
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password,10)
        }
        const updatedUser = await User.findByIdAndUpdate(id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar
            }
            
        },{new:true}).select('-password')
        if (req.body.password || req.body.email) {
            const token = await generateToken(updatedUser._id, res);
            return res.status(200).json({
              message: 'Updated successfully',
              user: updatedUser,
              token
            });
          }          
        return res.status(200).json({message:'Updated successfully',updatedUser})
       } catch (error) {
        console.log(error)
       }
}

export const deleteUser = async(req,res) =>{
    if(req.user.id !== req.params.id){
        return res.status(400).json({message:"U can only delete your own account"})
    }
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('jwt')
        return res.status(200).json({message:"User deleted Successfully"})
    } catch (error) {
        return res.status(500).json({message:"Server Error"})
    }
}

