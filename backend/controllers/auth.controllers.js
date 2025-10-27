import { errorHandler } from "../config/error.js";
import { generateToken } from "../config/token.js";
import User from "../models/user.model.js"
import bcrypt from "bcrypt";

export const signup = async(req,res,next) =>{
  try {
      const {username,email,password} = req.body
    if(!username || !email || !password) {
        return res.status(400).json({message:"Please fill all fields"})
    }
    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({message:"User already exist with this email"})
    }
    
    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })
    await newUser.save()
    if(newUser){
        const token = await generateToken(newUser._id,res)
        return res.status(200).json({message:"User registered Successfully ",newUser,token:token})
    }
    else{
        console.log("Something is wrong")
    }
  } catch (error) {
   next(error)
  }
}

export const signin = async(req,res,next) =>{
 try {
  const {email,password} = req.body
  const user = await User.findOne({email}).select("+password")
  if(!user){
    return res.status(400).json({message:"Invalid Credentials"})
  }
  const validPassword = await bcrypt.compare(password,user.password)
  if(!validPassword){
    return res.status(400).json({message:"Invalid Credentials"})
  }
  const token = await generateToken(user._id,res)
  return res.status(200).json({message:"User Logged in successfully",user:{
    _id: user._id,
    email:user.email,
    username:user.username
  },token:token})
 } catch (error) {
    next(error)
 }
}

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = await generateToken(user._id, res);
      return res.status(200).json({
        message: "User logged in successfully",
        user,
        token,
      });
    
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = await generateToken(newUser._id,res)
     
    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
     
    }
  }catch (error) {
    console.error("Google sign-in error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error during Google login" });
  }
  
};

export const signout = async(req,res) =>{
  try {
    res.clearCookie('jwt')
    return res.status(200).json({message:"User loggedOut Successfully"})
  } catch (error) {
    return res.status(500).json({message:"Server Error"})
  }
}