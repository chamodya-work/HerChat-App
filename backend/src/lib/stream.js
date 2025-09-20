import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey=process.env.STREAM_API_KEY;
const apiSecret=process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream API key or Secret is missing");
}

const streamClient=StreamChat.getInstance(apiKey,apiSecret);

//create or update a user in stream
export const upsertStreamUser=async(userData)=>{
    try{
        await streamClient.upsertUsers([userData]);
        return userData;
    }
    catch(err){
        console.error("Error in upserting Stream user",err);
    }
};

//todo: do it later
export const generateStreamToken=(userId)=>{
    try {

    //ensure userId is a String
    const userIdStr=userId.toSring();
    return streamClient.createToken(userIdStr);
        
    } catch (error) {
        console.log("Error generating Stream token");
    }

    
}
