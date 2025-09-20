import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptFriendRequest, getMyFriends, getRecommendedUsers, sendFriendRequest,getFriendRequest,getOutgoingFriendReqs} from '../controllers/user.controllers.js';

const router=express.Router();

router.use(protectRoute); //apply protectRoute middleware to all the routes


router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id",sendFriendRequest); // :id is the recipient id
router.put("/friend-request/:id/accept",acceptFriendRequest); 

router.get("/friend-requests",getFriendRequest); //get the friendRequest
router.get("/outgoing-friend-requests",getOutgoingFriendReqs); //get the where the sent friend reqest by me



export default router;