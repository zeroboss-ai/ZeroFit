import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    // Graceful in-memory fallback enabled
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('Connected to MongoDB successfully.');
      return m;
    }).catch((err) => {
      console.warn('MongoDB connection error, falling back to local store:', err.message);
      return null as any;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

// In-Memory / File-less persistent store for local zero-config usage
interface MockStore {
  users: Map<string, any>;
  profiles: Map<string, any>;
  progress: Map<string, any[]>;
  subscribers: Set<string>;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryStore: MockStore | undefined;
}

export const memoryStore: MockStore = global.memoryStore || {
  users: new Map(),
  profiles: new Map(),
  progress: new Map(),
  subscribers: new Set(),
};

if (!global.memoryStore) {
  global.memoryStore = memoryStore;
}
