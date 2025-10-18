import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js'; 

import { connectDB } from './lib/db.js';

dotenv.config();

const app=express();
const PORT=process.env.PORT;

const __dirname=path.resolve(); //this for calculate the path in deployment

app.use(cors({
    origin:"http://localhost:5173", //frontend end url
    credentials:true //allow frontend to send cookies
}));

app.use(express.json()); //middleware to parse json data
app.use(cookieParser()); //middleware to parse cookies



app.use("/api/auth",authRoutes); //main route for auth
app.use("/api/users",userRoutes); //main route for users   
app.use("/api/chat",chatRoutes);


//this is simply create our react app as static 
// for deployment purpose
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});