import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const connectToMongoDB = async ()=>
{
    try {
       await mongoose.connect(process.env.MONGO_URI);
       console.log('mongodb connected successfully')
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}


export default connectToMongoDB;