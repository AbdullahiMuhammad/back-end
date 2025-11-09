import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Function that connects to the database
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://muheey:Muheey%4025@incidents.s8i0vwj.mongodb.net/?appName=incidents"); // Wait for the connection to be established
        console.log("Database connection successful");
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

export default connectDB;
