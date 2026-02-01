'use client';

import { useState, useEffect } from 'react';
import { fetchLLMTraces, getTimeSeriesData, type TimeSeriesData } from '@/lib/tracer';

export function CostChartCard() {
  const [data, setData] = useState<TimeSeriesData[]>([]);

  useEffect(() => {
    const updateData = () => {
      const traces = fetchLLMTraces(100);
      const timeSeries = getTimeSeriesData(traces, 10); // 10分間隔
      setData(timeSeries.slice(-12)); // 最新12ポイント（2時間分）
    };

    updateData();
    const interval = setInterval(updateData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (data.length === 0) return <div>Loading...</div>;

  const maxTokens = Math.max(...data.map(d => d.tokens), 1);
  const maxCalls = Math.max(...data.map(d => d.calls), 1);

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all col-span-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📈 Activity & Tokens (Last 2h)</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-slate-400">Tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span className="text-slate-400">Calls</span>
          </div>
        </div>
      </div>

      <div className="relative h-48">
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {data.map((point, i) => {
            const tokensHeight = (point.tokens / maxTokens) * 100;
            const callsHeight = (point.calls / maxCalls) * 100;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {/* Calls bar */}
                <div
                  className="w-full bg-cyan-500/50 rounded-t transition-all hover:bg-cyan-500/70 cursor-pointer"
                  style={{ height: `${callsHeight}%` }}
                  title={`${point.calls} calls`}
                />
                {/* Tokens bar */}
                <div
                  className="w-full bg-purple-500/50 rounded-t transition-all hover:bg-purple-500/70 cursor-pointer"
                  style={{ height: `${tokensHeight}%` }}
                  title={`${point.tokens.toLocaleString()} tokens`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
        <div>
          <p className="text-slate-400 text-sm">Total Tokens (2h)</p>
          <p className="text-xl font-bold text-purple-400">
            {(data.reduce((sum, d) => sum + d.tokens, 0) / 1000).toFixed(1)}K
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Total Calls (2h)</p>
          <p className="text-xl font-bold text-cyan-400">
            {data.reduce((sum, d) => sum + d.calls, 0)}
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Avg Tokens/Call</p>
          <p className="text-xl font-bold text-green-400">
            {(data.reduce((sum, d) => sum + d.tokens, 0) / Math.max(data.reduce((sum, d) => sum + d.calls, 0), 1)).toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}
