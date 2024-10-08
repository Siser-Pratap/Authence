import bcryptjs from "bcryptjs";
import user_black_one from "../../userSchema/userSchema.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

// dotenv.config({path:"./.env"});

const signup = async(req, res)=>{

    
    
    console.log(req.body);
   

    const dbUrl = req.body.dbUrl;
    if(!dbUrl){
        const {username, password, email} = req.body;
        await mongoose.connect("mongodb+srv://jaysiserpratap:siser123@cluster0.bs31t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
            .then(()=>console.log("Connected to database"))
            .catch((err)=>console.log(err));
        const hashedPassword =bcryptjs.hashSync(password, 10);
        console.log(hashedPassword);
        const newUser = new user_black_one({username, password:hashedPassword, email});
        try {
            await newUser.save();
            console.log("user Created");
            res.status(201).json({message:"User created Successfully", data:{username, email, password}});
        } catch (error) {
            console.log(error.message);
            res.status(401).json({message:"Error creating user"});
        }
    }
    
    console.log("hello");
    // const userName = await user_black_one.findOne({username: username});
    // const Email = await user_black_one.findOne({email: email});

    // if(userName){
    //     res.json({message:"Username already taken"});
    // }

    // if(Email){
    //     res.json({message:"User already registered"});
    // }
    
}

export default signup;

