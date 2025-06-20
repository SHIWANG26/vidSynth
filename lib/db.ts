import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI){
    throw new Error("Please define the MONGODB_URI environment variable inside .env variables");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {
        conn: null,
        Promise: null
    };
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if(!cached.Promise) {
        const opts = {
            bufferCommands: true,// Disable mongoose's buffering mechanism
            maxPoolSize: 10, // Maintain up to 10 socket connections
        }
        mongoose
        .connect(MONGODB_URI, opts)
        .then(() => mongoose.connection);
    }
    try{
        cached.conn = await cached.Promise;
    }
    catch(error){
        cached.Promise = null;
        throw error;
    }
    return cached.conn;
}