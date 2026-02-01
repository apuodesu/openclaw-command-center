'use client';

import { useState, useEffect } from 'react';
import { fetchLLMTraces, calculateMetrics, type LLMMetrics } from '@/lib/tracer';

export function LLMMetricsCard() {
  const [metrics, setMetrics] = useState<LLMMetrics | null>(null);

  useEffect(() => {
    const updateMetrics = () => {
      const traces = fetchLLMTraces(100);
      const m = calculateMetrics(traces);
      setMetrics(m);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000); // 30秒ごと

    return () => clearInterval(interval);
  }, []);

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">⚡ LLM Metrics</h2>
        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full border border-purple-500/30">
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <p className="text-slate-400 text-sm mb-1">Total Calls</p>
          <p className="text-2xl font-bold text-cyan-400">{metrics.totalCalls.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">{metrics.callsPerHour.toFixed(1)}/hr</p>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <p className="text-slate-400 text-sm mb-1">Avg Latency</p>
          <p className="text-2xl font-bold text-cyan-400">{metrics.averageLatency.toFixed(0)}ms</p>
          <p className="text-xs text-slate-500 mt-1">
            {metrics.averageLatency < 2000 ? '🟢 Fast' : metrics.averageLatency < 4000 ? '🟡 Normal' : '🔴 Slow'}
          </p>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <p className="text-slate-400 text-sm mb-1">Total Tokens</p>
          <p className="text-2xl font-bold text-cyan-400">{(metrics.totalTokens / 1000).toFixed(1)}K</p>
          <p className="text-xs text-slate-500 mt-1">Input + Output</p>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <p className="text-slate-400 text-sm mb-1">Total Cost</p>
          <p className="text-2xl font-bold text-green-400">${metrics.totalCost.toFixed(3)}</p>
          <p className="text-xs text-slate-500 mt-1">Last 100 calls</p>
        </div>
      </div>

      {metrics.errorRate > 0 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">
            ⚠️ Error rate: {(metrics.errorRate * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}
