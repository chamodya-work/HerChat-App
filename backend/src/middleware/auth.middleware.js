import jwt from 'jsonwebtoken';
import User from '../models/User';

export const protectRoute= async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized, No token provided"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(!decoded){
            return res.status(401).json({message:"Unauthorized, invalid token"});
        }

        const user=await User.findById(decoded.userId).select('-password'); //exclude password

        if(!user){
            return res.status(401).json({message:"Unauthorized- User not found"});
        }

        req.user=user; //attach user to request object
        next();
    }
    catch(err){
        console.log("Error in protectRoute middleware",err);
        res.status(500).json({message:"Internal Server Error"});
    }
}