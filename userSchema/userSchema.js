import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String, 
        required:true,
    }
},{timeStamps:true});

const user_black_one = mongoose.model("User", userSchema);

export default user_black_one;


