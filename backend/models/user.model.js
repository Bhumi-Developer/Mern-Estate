
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    token:{
        type:String
    },
    avatar:{
      type: String,
      default: "https://i.pinimg.com/1200x/0c/4e/fd/0c4efdb2f5bf2a3e993fc23f4de50e4e.jpg"
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
