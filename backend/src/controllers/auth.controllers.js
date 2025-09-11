import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    const { fullName, email, password } = req.body; //destructuring req.body
    try{
        if(!email || !password || !fullName){
            return res.status(400).json({message:"Please provide all required fields"});
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"email already exists"});
        }

        const idx=Math.floor(Math.random()*100)+1; //1-100 numbers for profile pic selection
        const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`;
        
        const newUser=await User.create(
            {
                email,
                password,
                fullName,
                profilePic:randomAvatar
            }
        );

        // TODO; CREATE THE USER IN STREAM AS WEll 

        const token=jwt.sign(
            {userId:newUser._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'7d'}
        );

        res.cookie('jwt',token,{
            maxAge:7*24*60*60*1000, //7 days in milliseconds
            httpOnly:true, //accessible only by web server
            sameSite:"strict",//CSRF
            secure:process.env.NODE_ENV==='production' //https only in production
        });

        res.status(201).json({success:true,user:newUser});


            
    } catch(err){
        console.log("Error in signup Controller",err);
        res.status(500).json({message: "Internal Server Error"});
    }

}

export async function login(req, res) {
  res.send("login routed");
}

export function logout(req, res) {
  res.send("logout routed");
}
