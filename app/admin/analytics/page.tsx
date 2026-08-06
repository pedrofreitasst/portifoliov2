// app/admin/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/chat/analytics');
        if (!res.ok) throw new Error('Erro ao buscar dados');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">❌ {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📊 Analytics do Chatbot</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Mensagens</p>
            <p className="text-2xl font-bold">{data.totalMessages}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Taxa de Erro</p>
            <p className="text-2xl font-bold text-green-600">{data.errorRate}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Provedores</p>
            {data.providerStats?.map((p: any) => (
              <div key={p._id} className="flex justify-between text-sm">
                <span className="capitalize">{p._id}</span>
                <span>{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500 mb-2">Mensagens por Hora</p>
          <div className="flex items-end gap-1 h-32">
            {data.messagesByHour?.map((hour: any) => {
              const maxCount = Math.max(...data.messagesByHour.map((h: any) => h.count), 1);
              const height = (hour.count / maxCount) * 100;
              return (
                <div key={hour._id} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-1">
                    {String(hour._id).padStart(2, '0')}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}