import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
    try{
        const currentUserId = req.user._id; //from protectRoute middleware
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            //query to find users who are not current user and not in friends list and isOnboarded is true
            $and: [
                {_id: { $ne: currentUserId }}, //exclude current user
                {_id: { $nin: currentUser.friends }}, //exclude friends
                {isOnboarded: true} //only onboarded users
            ]
        });

        res.status(200).json(recommendedUsers); //return the recommended users
    }
    catch(err){
        console.log("Error in getRecommendedUsers Controller",err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function getMyFriends(req, res) {
    try{
        const user=await User.findById(req.user._id)
        .select("friends") //only give ids of friends
        .populate("friends","fullName profilePic nativeLanguage learningLanguage"); //populate friends with fullName and profilePic and languages

        res.status(200).json(user.friends); //return the friends array

    }
    catch(err){
        console.log("Error in getMyFriends Controller",err);
        res.status(500).json({message: "Internal Server Error"});

    }
}