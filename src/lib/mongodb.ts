import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

// Next.js hot-reloads modules in dev, which would open a new connection on every
// file save. Caching on globalThis survives the reload, so we reuse one connection.
declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis._mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis._mongooseCache = cache;

export async function connectToDatabase(): Promise<Mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local");
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Drop the failed promise so the next request can retry instead of
    // replaying the same rejection forever.
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
