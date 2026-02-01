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

  const maxCost = Math.max(...data.map(d => d.cost), 0.001);
  const maxCalls = Math.max(...data.map(d => d.calls), 1);

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all col-span-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📈 Cost & Activity (Last 2h)</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-slate-400">Cost</span>
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
            const costHeight = (point.cost / maxCost) * 100;
            const callsHeight = (point.calls / maxCalls) * 100;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {/* Calls bar */}
                <div
                  className="w-full bg-cyan-500/50 rounded-t transition-all hover:bg-cyan-500/70 cursor-pointer"
                  style={{ height: `${callsHeight}%` }}
                  title={`${point.calls} calls`}
                />
                {/* Cost bar */}
                <div
                  className="w-full bg-green-500/50 rounded-t transition-all hover:bg-green-500/70 cursor-pointer"
                  style={{ height: `${costHeight}%` }}
                  title={`$${point.cost.toFixed(4)}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
        <div>
          <p className="text-slate-400 text-sm">Total Cost (2h)</p>
          <p className="text-xl font-bold text-green-400">
            ${data.reduce((sum, d) => sum + d.cost, 0).toFixed(3)}
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Total Calls (2h)</p>
          <p className="text-xl font-bold text-cyan-400">
            {data.reduce((sum, d) => sum + d.calls, 0)}
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Avg Cost/Call</p>
          <p className="text-xl font-bold text-purple-400">
            ${(data.reduce((sum, d) => sum + d.cost, 0) / Math.max(data.reduce((sum, d) => sum + d.calls, 0), 1)).toFixed(5)}
          </p>
        </div>
      </div>
    </div>
  );
}
