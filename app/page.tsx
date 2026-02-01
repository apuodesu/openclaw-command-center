'use client';

import { useState, useEffect } from 'react';
import { SessionCard } from '@/components/SessionCard';
import { MemoryCard } from '@/components/MemoryCard';
import { TaskCard } from '@/components/TaskCard';
import { DeployCard } from '@/components/DeployCard';

export default function CommandCenter() {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // 30秒ごと

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            🦞 OpenClaw Command Center
          </h1>
          <p className="text-slate-400">
            最終更新: {lastUpdate.toLocaleTimeString('ja-JP')}
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SessionCard />
          <MemoryCard />
          <TaskCard />
          <DeployCard />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>OpenClaw v2026.1.29 | Auto-refresh: 30s</p>
        </footer>
      </div>
    </main>
  );
}
