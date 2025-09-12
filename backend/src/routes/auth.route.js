import express from 'express';
import { signup,login,logout, onboard } from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/onboarding",protectRoute,onboard); //when we hitting "/onboarding api,before going to onbord controller it will go to protectRoute middleware to verify the user is authenticated or not"

export default router;