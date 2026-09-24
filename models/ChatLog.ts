// models/ChatLog.ts
import mongoose from 'mongoose';

const ChatLogSchema = new mongoose.Schema(
  {
    sessionId: { 
      type: String, 
      required: true,
      index: true 
    },
    userMessage: { 
      type: String, 
      required: true 
    },
    botReply: { 
      type: String, 
      required: true 
    },
    providerUsed: { 
      type: String, 
      enum: ['groq', 'openrouter', 'mock'], 
      required: true 
    },
    responseTimeMs: { 
      type: Number, 
      required: true 
    },
    success: { 
      type: Boolean, 
      default: true 
    },
    errorMessage: { 
      type: String, 
      default: null 
    },
    locale: { 
      type: String, 
      default: 'en' 
    },
    userAgent: { 
      type: String, 
      default: null 
    },
    // Hash anÃ´nimo do IP para evitar PII
    ipHash: { 
      type: String, 
      default: null 
    }
  },
  {
    timestamps: true, // adiciona createdAt e updatedAt automaticamente
  }
);

// Ãndices para consultas rÃ¡pidas
ChatLogSchema.index({ createdAt: -1 });
ChatLogSchema.index({ providerUsed: 1, createdAt: -1 });
ChatLogSchema.index({ success: 1, createdAt: -1 });

export const ChatLog = mongoose.models.ChatLog || mongoose.model('ChatLog', ChatLogSchema);