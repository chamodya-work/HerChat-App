import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

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

export async function sendFriendRequest(req,res){
    try{
        const myId=req.user.id;
        const {id:recipientId}=req.params;

        if(myId===recipientId){
            return res.status(400).json({message:"You cannot send friend request to yourself"});
        }

        const recipient=await User.findById(recipientId);

        //check if recipient exists in the database
        if(!recipient){
            return res.status(404).json({message:"Recipient not found"});
        }

        //check if user is already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"});
        }

        //check if friend request is already sent
        const existingRequest= await FriendRequest.findOne({
            $or:[
                {sender:myId, recipient:recipientId},
                {sender:recipientId, recipient:myId}
            ]
        });

        if(existingRequest){
            return res.status(400).json({message:" A friend request is already exists between you and this user"});
        }

        const friendRequest= await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        });

        res.status(200).json(friendRequest); //return the created friend request
    }
    catch(err){
        console.log("Error in sendFriendRequest Controller",err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function acceptFriendRequest(req,res){
    try{
        const {id:requestId}=req.params;
        const friendRequest=await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});
        }

        // verify the current user is the recipient
        if(friendRequest.recipient.toString() !==req.user.id){
            return res.status(403).json({message:"you are not authorized to accept this request"});
        }

        friendRequest.status="accepted";
        await friendRequest.save(); //save to the database
        
        // add each user to the other's friends array
        // $addToSet: adds elements to an array only if they do not already exist.
        await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
          });

        res.status(200).json({message:"Friend request accepted"});
    }
    catch(err){
        console.log("Error in acceptFriendRequest controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getFriendRequest(req,res){
    try {
        const incomingReq= await FriendRequest.find({
            recipient:req.user.id,
            status:"pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");
    
        const acceptedReq= await FriendRequest.find(
            {
                sender:req.user.id,
                status:"accepted"
            }
        ).populate("recipient", "fullName profilePic");
    
        res.status(200).json({incomingReq, acceptedReq});
        
    } catch (error) {
        console.log("Error in getPendingFrienndRequests controller");
        res.status(500).json({message:"Internal Server Error"});
    }
    
}

export async function getOutgoingFriendReqs(req,res) {
    try {
        const outgoingRequest=await FriendRequest.find({
            sender:req.user.id,
            status:"pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
        
        res.status(200).json(outgoingRequest);

    } catch (error) {
        console.log("Error in getOutgoingReqs controller",err.message);
        res.status(500).json({message:"Internal Server Error"});
    }

}