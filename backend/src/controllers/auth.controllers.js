import User from "../models/User.js";

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
        
            
    } catch(err){

    }

}

export async function login(req, res) {
  res.send("login routed");
}

export function logout(req, res) {
  res.send("logout routed");
}
