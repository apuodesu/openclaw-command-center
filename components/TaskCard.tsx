'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
}

export function TaskCard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'ClawMatch direction decision', priority: 'high', done: false },
    { id: '2', title: 'Instagram accounts (10)', priority: 'medium', done: false },
    { id: '3', title: 'OZEN daily operations', priority: 'medium', done: true },
  ]);

  const pendingTasks = tasks.filter(t => !t.done);
  const highPriorityCount = pendingTasks.filter(t => t.priority === 'high').length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📋 Tasks</h2>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30">
          {pendingTasks.length} pending
        </span>
      </div>

      <div className="space-y-3">
        {tasks.slice(0, 4).map(task => (
          <div
            key={task.id}
            className={`p-3 rounded-lg border transition-all ${
              task.done
                ? 'bg-slate-700/30 border-slate-600 opacity-60'
                : 'bg-slate-700/50 border-slate-600 hover:border-cyan-500/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => {
                  setTasks(prev =>
                    prev.map(t => (t.id === task.id ? { ...t, done: !t.done } : t))
                  );
                }}
                className="mt-1 w-4 h-4 accent-cyan-500"
              />
              <div className="flex-1">
                <p className={`text-sm ${task.done ? 'line-through text-slate-500' : ''}`}>
                  {task.title}
                </p>
                <p className={`text-xs mt-1 ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()} PRIORITY
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {highPriorityCount > 0 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">
            ⚠️ {highPriorityCount} high-priority task{highPriorityCount > 1 ? 's' : ''} pending
          </p>
        </div>
      )}
    </div>
  );
}
