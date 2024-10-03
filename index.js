import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp/SignUp";
// import user_black_one from "../../userSchema/userSchema";
// import bcryptjs from "bcryptjs";
// import jwt from jsonwebtoken;


const signup = async(req, res)=>{

    const {username, password, email} = req.body;
    // const hashedPassword =bcryptjs.hashSync(password, 10);

    // const userName = await user_black_one.findOne({username: username});
    // const Email = await user_black_one.findOne({email: email});

    // if(userName){
    //     res.json({message:"Username already taken"});
    // }

    // if(Email){
    //     res.json({message:"User already registered"});
    // }
        
    

    // const newUser = new user_black_one({username, password:hashedPassword, email});
    try {
        // await newUser.save();
        res.status(201).json({message:"User created Successfully", data:{username, email, password}});
    } catch (error) {
        res.status(401).json({message:"Error creating user"});
    }

}












export {SignIn, SignUp, signup};