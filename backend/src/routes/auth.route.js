import express from 'express';
import { signup,login,logout,onbord } from '../controllers/auth.controllers.js';

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/onboarding",protectRoute,onbord);

export default router;