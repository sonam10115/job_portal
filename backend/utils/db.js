import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        await mongoose.connect(mongoUri);
        console.log("✅ MongoDB connected successfully");
        return true;
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        console.error("Make sure:");
        console.error("  1. MongoDB Atlas cluster is active");
        console.error("  2. MONGODB_URI in .env is correct");
        console.error("  3. Your IP is whitelisted in MongoDB Atlas");
        throw error;
    }
};

export default connectDB;