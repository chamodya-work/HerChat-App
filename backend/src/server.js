import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();

const app=express();
const PORT=process.env.PORT;

app.use(express.json()); //middleware to parse json data
app.use(cookieParser()); //middleware to parse cookies

app.use("/api/auth",authRoutes); //main route for auth
app.use("/api/users",userRoutes); //main route for users    


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});