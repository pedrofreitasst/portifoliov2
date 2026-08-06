// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    '❌ Por favor, defina a variável MONGODB_URI no arquivo .env.local'
  );
}

// 🛡️ Tipagem explícita para o cache global
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<typeof mongoose> | null;
}

// 🔧 Extensão segura do objeto global
declare global {
  var mongoose: MongooseCache;
}

// Inicializa o cache global
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Se já existe conexão ativa, reutiliza
  if (cached.conn) {
    console.log('🔌 Reutilizando conexão existente com MongoDB');
    return cached.conn as unknown as typeof mongoose;
  }

  // Se não tem promise em andamento, cria uma nova
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Máximo de conexões simultâneas
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
    };

    console.log('🔄 Conectando ao MongoDB Atlas...');

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('❌ Erro ao conectar ao MongoDB:', error);
        // Reseta a promise para permitir novas tentativas
        cached.promise = null;
        throw error;
      });
  }

  // Aguarda a conexão
  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance.connection;
    return mongooseInstance;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}