'use client';

import { useState, useEffect } from 'react';

export function MemoryCard() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [status, setStatus] = useState<'ok' | 'warning' | 'error'>('ok');

  useEffect(() => {
    // Mock: 実際は /home/clawd/ebi/memory/2026-02-01.md の stat 結果
    const now = new Date();
    const mockLastUpdate = new Date(now.getTime() - 15 * 60 * 1000); // 15分前
    setLastUpdate(mockLastUpdate);

    const minutesAgo = Math.floor((now.getTime() - mockLastUpdate.getTime()) / 60000);
    if (minutesAgo >= 60) setStatus('error');
    else if (minutesAgo >= 30) setStatus('warning');
    else setStatus('ok');
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'ok': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'ok': return '🟢';
      case 'warning': return '🟡';
      case 'error': return '🔴';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">🧠 Memory Status</h2>
        <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor()}`}>
          {getStatusIcon()} {status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-slate-400 text-sm mb-1">Work Log</p>
          <p className="font-mono text-sm text-cyan-400">
            memory/2026-02-01.md
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {lastUpdate ? `Updated ${Math.floor((Date.now() - lastUpdate.getTime()) / 60000)}m ago` : 'Loading...'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
          <div>
            <p className="text-slate-400 text-sm">Supermemory</p>
            <p className="font-semibold text-cyan-400">✓ Synced</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Daily Notes</p>
            <p className="font-semibold text-cyan-400">3 entries</p>
          </div>
        </div>
      </div>
    </div>
  );
}
