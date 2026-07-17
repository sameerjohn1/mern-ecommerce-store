import mongoose from "mongoose";

let isConnected = false;

export const connectDb = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error("Error connecting to MongoDB:", error.message);
    throw error; 
  }
};