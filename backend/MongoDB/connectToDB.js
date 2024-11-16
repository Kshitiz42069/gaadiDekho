import mongoose from "mongoose";

const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.mongoDB_URI);
        console.log("database is connected");
    } catch (error) {
        console.log("database is not connected");
    }
}

export default connectToDb;