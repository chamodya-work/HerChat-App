import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptFriendRequest, getMyFriends, getRecommendedUsers, sendFriendRequest,getFriendRequest } from '../controllers/user.controllers.js';

const router=express.Router();

router.use(protectRoute); //apply protectRoute middleware to all the routes


router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id",sendFriendRequest); // :id is the recipient id
router.put("/friend-request/:id/accept",acceptFriendRequest); 

router.get("/friend-requests",getFriendRequest); 



export default router;