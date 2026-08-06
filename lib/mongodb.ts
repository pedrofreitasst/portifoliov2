// lib/mongodb.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 🔥 Carrega o .env.local explicitamente
dotenv.config({ path: '.env.local.example' });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    '❌ Por favor, defina a variável MONGODB_URI no arquivo .env.local'
  );
}

console.log('🔍 MONGODB_URI carregada:', MONGODB_URI.substring(0, 20) + '...');

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('🔌 Reutilizando conexão existente');
    return cached.conn as unknown as typeof mongoose;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    console.log('🔄 Conectando ao MongoDB Atlas...');

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('✅ Conectado ao MongoDB Atlas!');
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('❌ Erro ao conectar:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance.connection;
    return mongooseInstance;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}