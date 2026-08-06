// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ 
      status: '✅ Conectado ao MongoDB Atlas!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: '❌ Falha na conexão',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}