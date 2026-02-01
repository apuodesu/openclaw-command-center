'use client';

import { useState, useEffect } from 'react';
import { fetchLLMTraces, type LLMTrace } from '@/lib/tracer';

export function TraceHistoryCard() {
  const [traces, setTraces] = useState<LLMTrace[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');

  useEffect(() => {
    const updateTraces = () => {
      const data = fetchLLMTraces(20);
      setTraces(data);
    };

    updateTraces();
    const interval = setInterval(updateTraces, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredTraces = traces.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const getModelShortName = (model: string) => {
    if (model.includes('sonnet')) return 'Sonnet';
    if (model.includes('opus')) return 'Opus';
    if (model.includes('haiku')) return 'Haiku';
    if (model.includes('kimi')) return 'Kimi';
    return 'Unknown';
  };

  const getModelColor = (model: string) => {
    if (model.includes('sonnet')) return 'text-cyan-400';
    if (model.includes('opus')) return 'text-purple-400';
    if (model.includes('haiku')) return 'text-green-400';
    if (model.includes('kimi')) return 'text-orange-400';
    return 'text-slate-400';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all col-span-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📜 Trace History</h2>
        <div className="flex gap-2">
          {(['all', 'success', 'error'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded-full border transition-all ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                  : 'bg-slate-700/30 text-slate-400 border-slate-600 hover:border-cyan-500/30'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTraces.map(trace => (
          <div
            key={trace.id}
            className={`p-3 rounded-lg border transition-all ${
              trace.status === 'error'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-slate-700/30 border-slate-600 hover:border-cyan-500/30'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold text-sm ${getModelColor(trace.model)}`}>
                    {getModelShortName(trace.model)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(trace.timestamp).toLocaleTimeString('ja-JP')}
                  </span>
                  {trace.status === 'error' && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                      Error
                    </span>
                  )}
                </div>
                {trace.error && (
                  <p className="text-sm text-red-400 mb-1">{trace.error}</p>
                )}
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>🎯 {trace.totalTokens.toLocaleString()} tokens</span>
                  <span>⏱️ {trace.latencyMs}ms</span>
                  <span>💰 ${trace.cost.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
