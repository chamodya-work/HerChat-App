import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMyFriends, getRecommendedUsers, sendFriendRequest } from '../controllers/user.controllers.js';

const router=express.Router();

router.use(protectRoute); //apply protectRoute middleware to all the routes


router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("friend-request/:id",sendFriendRequest);


export default router;