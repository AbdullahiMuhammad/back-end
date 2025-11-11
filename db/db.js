import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Function that connects to the database
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/nmdpra"); // Wait for the connection to be established
        console.log("Database connection successful");
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

export default connectDB;
