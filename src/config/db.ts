import mongoose from "mongoose";

export const connectDB  = async (): Promise<void> =>{
    try{
        const uri = process.env.MONGODB_URI as string;
        await mongoose.connect(uri);
        console.log('MongoDB is connected successfully');
    } catch (error){
        console.error('Error connection failed', error);
        process.exit(1);
    }
};
