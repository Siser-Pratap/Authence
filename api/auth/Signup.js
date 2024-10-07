import bcryptjs from "bcryptjs";
import user_black_one from "../../userSchema/userSchema.js";
const signup = async(req, res)=>{
    
    const {username, password, email} = req.body;
    // console.log(username, password, email);
    const hashedPassword =bcryptjs.hashSync(password, 10);
    console.log(hashedPassword);

    const userName = await user_black_one.findOne({username: username});
    const Email = await user_black_one.findOne({email: email});

    if(userName){
        res.json({message:"Username already taken"});
    }

    if(Email){
        res.json({message:"User already registered"});
    }

    const newUser = new user_black_one({username, password:hashedPassword, email});

    try {
        await newUser.save();
        res.status(201).json({message:"User created Successfully", data:{username, email, password}});
    } catch (error) {
        res.status(401).json({message:"Error creating user"});
    }
}

export default signup;

