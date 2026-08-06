// app/api/chat/analytics/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ChatLog } from '@/models/ChatLog';

export async function GET() {
  try {
    // Conecta ao MongoDB
    await connectToDatabase();

    // Últimas 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Busca dados agregados
    const [totalMessages, providerStats, errorStats, messagesByHour] = await Promise.all([
      // Total de mensagens nas últimas 24h
      ChatLog.countDocuments({ createdAt: { $gte: oneDayAgo } }),

      // Distribuição por provedor
      ChatLog.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        { $group: { _id: '$providerUsed', count: { $sum: 1 } } }
      ]),

      // Taxa de erro
      ChatLog.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        { $group: { _id: '$success', count: { $sum: 1 } } }
      ]),

      // Mensagens por hora
      ChatLog.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        {
          $group: {
            _id: { $hour: '$createdAt' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Calcula taxa de erro
    const total = errorStats.reduce((acc, curr) => acc + curr.count, 0);
    const errors = errorStats.find((e) => e._id === false)?.count || 0;
    const errorRate = total > 0 ? ((errors / total) * 100).toFixed(2) : 0;

    return NextResponse.json({
      period: '24h',
      totalMessages,
      providerStats,
      errorRate: `${errorRate}%`,
      messagesByHour,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao buscar analytics:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados de analytics' },
      { status: 500 }
    );
  }
}