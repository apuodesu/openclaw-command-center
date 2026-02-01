'use client';

import { useState, useEffect } from 'react';

interface Deployment {
  name: string;
  url: string;
  status: 'ready' | 'building' | 'error';
  timestamp: Date;
}

export function DeployCard() {
  const [deployments] = useState<Deployment[]>([
    { 
      name: 'moltbook-news', 
      url: 'https://moltbook-news.vercel.app',
      status: 'ready',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2時間前
    },
    { 
      name: 'reversi', 
      url: 'https://reversi-alpha.vercel.app',
      status: 'ready',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3時間前
    },
    { 
      name: 'command-center', 
      url: 'https://openclaw-command-center.vercel.app',
      status: 'building',
      timestamp: new Date()
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'building': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return '✓';
      case 'building': return '⏳';
      case 'error': return '✗';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">🚀 Deployments</h2>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
          {deployments.filter(d => d.status === 'ready').length}/{deployments.length} ready
        </span>
      </div>

      <div className="space-y-3">
        {deployments.map((deploy, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border border-slate-600 bg-slate-700/30 hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm">{deploy.name}</p>
              <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(deploy.status)}`}>
                {getStatusIcon(deploy.status)} {deploy.status.toUpperCase()}
              </span>
            </div>
            <a
              href={deploy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 truncate block"
            >
              {deploy.url}
            </a>
            <p className="text-xs text-slate-500 mt-1">
              {Math.floor((Date.now() - deploy.timestamp.getTime()) / 60000)}m ago
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-slate-700/30 border border-slate-600 rounded-lg">
        <p className="text-sm text-slate-400">
          📦 GitHub: <span className="text-cyan-400 font-mono">apuodesu/ebi</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">Last push: 15m ago</p>
      </div>
    </div>
  );
}
