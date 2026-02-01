'use client';

import { useState, useEffect } from 'react';

export function SessionCard() {
  const [tokens, setTokens] = useState(42000);
  const tokenLimit = 200000;
  const percentage = Math.round((tokens / tokenLimit) * 100);

  useEffect(() => {
    // Mock: 実際はAPI呼び出し
    const interval = setInterval(() => {
      setTokens(prev => Math.min(prev + Math.random() * 1000, tokenLimit));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📊 Session Status</h2>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
          🟢 Active
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Token Usage</span>
            <span className="font-mono text-cyan-400">{tokens.toLocaleString()} / {tokenLimit.toLocaleString()}</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">{percentage}% used</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
          <div>
            <p className="text-slate-400 text-sm">Main Agent</p>
            <p className="font-semibold text-cyan-400">✓ Running</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Worker Agent</p>
            <p className="font-semibold text-cyan-400">✓ Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
