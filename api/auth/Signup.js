import bcryptjs from "bcryptjs";
import user_black_one from "../../userSchema/userSchema.js";
import dotenv from "dotenv";

dotenv.config();

const signup = async(req, res)=>{
    
    console.log(req.body);
    const dbUrl = req.body.dbUrl;
    if(!dbUrl){
        const {username, password, email} = req.body;
        mongoose.connect(`${process.env.MONGODB_URL}`)
        .then(()=>console.log("Connected to database"))
        .catch((err)=>console.log(err));
        const hashedPassword =bcryptjs.hashSync(password, 10);
        console.log(hashedPassword);
        const newUser = new user_black_one({username, password:hashedPassword, email});
    }
    
    // const dbUrl = req.body.dbUrl;
    
    // if(!dbUrl){
        
    // }
    
    

    // const userName = await user_black_one.findOne({username: username});
    // const Email = await user_black_one.findOne({email: email});

    // if(userName){
    //     res.json({message:"Username already taken"});
    // }

    // if(Email){
    //     res.json({message:"User already registered"});
    // }

    

    try {
        await newUser.save();
        res.status(201).json({message:"User created Successfully", data:{username, email, password}});
    } catch (error) {
        res.status(401).json({message:"Error creating user"});
    }
}

export default signup;

