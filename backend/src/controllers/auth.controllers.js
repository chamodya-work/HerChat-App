import { upsertStreamUser } from "../lib/stream.js";
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

        
        // This line creates the user AND saves it to the database in one command.
        // It triggers the 'pre('save')' middleware.
        const newUser=await User.create( 
            {
                email,
                password,
                fullName,
                profilePic:randomAvatar
            }
        );

        // TODO; CREATE THE USER IN STREAM AS WEll 
        try{
            await upsertStreamUser({
                id:newUser._id.toString(),
                name:newUser.fullName,
                image:newUser.profilePic || "",
            });
        console.log(`Stream User created for ${newUser.fullName}`);
        }
        catch(err){
            console.error("Error in creating Stream user",err);
        }

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
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user=await User.findOne({email});
        if(!user) return res.status(401).json({message:"Invalid email or password"});

        const isPasswordCorrect=await user.matchPassword(password);
        if(!isPasswordCorrect) return res.status(401).json({message:"Invalid email or password"});


        //user is authenticated, generate a JWT token 
        const token=jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'7d'}
        );

        // set jwt token to cookie
        res.cookie('jwt',token,{
            maxAge:7*24*60*60*1000, //7 days in milliseconds
            httpOnly:true, //accessible only by web server
            sameSite:"strict",//CSRF
            secure:process.env.NODE_ENV==='production' //https only in production
        });

        res.status(200).json({success:true,user});

    }
    catch(err){
        console.log("Error in login Controller",err);
        res.status(500).json({message: "Internal Server Error"});

    }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({success:true, message: "Logged out successfully" });
}

export async function onboard(req, res) {
    try{
        const userId=req.user._id; //from protectRoute middleware
        const{fullName, bio, nativeLanguage, learningLanguage, location}=req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean) //remove falsy values
                });

        }
        const updatedUser=await User.findByIdAndUpdate(userId,{
            ...req.body, //spread operator to update all fields from req.body
            isOnboarded:true
        },
        {new:true} //to return the updated user
        );

        if(!updatedUser){
            return res.status(404).json({message:"User not found"});
        }

        //Todo: update the userinfo in stream as well
        try{
            await upsertStreamUser({
                id:updatedUser._id.toString(),
                name:updatedUser.fullName,
                image:updatedUser.profilePic || "",
            });
            console.log(`Stream User updated after onboarding for ${updatedUser.fullName}`);
        }
        catch(err){
            console.log("Error in updating Stream user during onboarding",err);
        }

        
    
        //send back the updated user
        res.status(200).json({success:true,user:updatedUser});
    }
    catch(err){
        console.log("Error in onbord Controller",err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

