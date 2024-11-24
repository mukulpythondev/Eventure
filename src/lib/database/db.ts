import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}


let cached= (global as any).mongoose || {con : null, promise : null} ;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}


export const dbConnect= async ()=>{
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName:"eventure",
      bufferCommands:false,
      connectTimeoutMS:30000
    })
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
