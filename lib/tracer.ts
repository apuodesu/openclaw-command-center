// OpenClaw LLM Tracer
// ログファイルやAPIからLLMコール履歴を取得

export interface LLMTrace {
  id: string;
  timestamp: Date;
  model: string;
  prompt: string;
  response: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  cost: number;
  status: 'success' | 'error';
  error?: string;
}

export interface LLMMetrics {
  totalCalls: number;
  totalTokens: number;
  totalCost: number;
  averageLatency: number;
  errorRate: number;
  callsPerHour: number;
}

// モデル別コスト（USD per 1M tokens）
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'anthropic/claude-sonnet-4-5': { input: 3.0, output: 15.0 },
  'anthropic/claude-opus-4-5': { input: 15.0, output: 75.0 },
  'anthropic/claude-haiku-4-5': { input: 1.0, output: 5.0 },
  'fireworks/kimi-k2p5': { input: 1.5, output: 1.5 },
};

// コスト計算
export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const costs = MODEL_COSTS[model] || { input: 3.0, output: 15.0 }; // デフォルト: Sonnet
  return (inputTokens / 1_000_000) * costs.input + (outputTokens / 1_000_000) * costs.output;
}

// Mock データ生成（実際はログファイル or API）
export function fetchLLMTraces(limit: number = 50): LLMTrace[] {
  const models = [
    'anthropic/claude-sonnet-4-5',
    'anthropic/claude-opus-4-5',
    'anthropic/claude-haiku-4-5',
  ];

  const traces: LLMTrace[] = [];
  const now = Date.now();

  for (let i = 0; i < limit; i++) {
    const model = models[Math.floor(Math.random() * models.length)];
    const inputTokens = Math.floor(Math.random() * 5000) + 500;
    const outputTokens = Math.floor(Math.random() * 2000) + 200;
    const totalTokens = inputTokens + outputTokens;
    const latencyMs = Math.floor(Math.random() * 3000) + 500;
    const cost = calculateCost(model, inputTokens, outputTokens);
    const status = Math.random() > 0.95 ? 'error' : 'success';

    traces.push({
      id: `trace-${i}`,
      timestamp: new Date(now - i * 60000), // 1分ごと
      model,
      prompt: 'User request...',
      response: status === 'success' ? 'AI response...' : '',
      inputTokens,
      outputTokens,
      totalTokens,
      latencyMs,
      cost,
      status,
      error: status === 'error' ? 'Rate limit exceeded' : undefined,
    });
  }

  return traces;
}

// メトリクス計算
export function calculateMetrics(traces: LLMTrace[]): LLMMetrics {
  const successTraces = traces.filter(t => t.status === 'success');
  const totalTokens = traces.reduce((sum, t) => sum + t.totalTokens, 0);
  const totalCost = traces.reduce((sum, t) => sum + t.cost, 0);
  const totalLatency = successTraces.reduce((sum, t) => sum + t.latencyMs, 0);
  
  const oldestTimestamp = traces[traces.length - 1]?.timestamp.getTime() || Date.now();
  const newestTimestamp = traces[0]?.timestamp.getTime() || Date.now();
  const hoursDiff = (newestTimestamp - oldestTimestamp) / (1000 * 60 * 60);
  const callsPerHour = hoursDiff > 0 ? traces.length / hoursDiff : 0;

  return {
    totalCalls: traces.length,
    totalTokens,
    totalCost,
    averageLatency: successTraces.length > 0 ? totalLatency / successTraces.length : 0,
    errorRate: traces.length > 0 ? (traces.length - successTraces.length) / traces.length : 0,
    callsPerHour,
  };
}

// 時系列データ（グラフ用）
export interface TimeSeriesData {
  timestamp: string;
  calls: number;
  tokens: number;
  cost: number;
  latency: number;
}

export function getTimeSeriesData(traces: LLMTrace[], intervalMinutes: number = 10): TimeSeriesData[] {
  const buckets = new Map<string, LLMTrace[]>();

  traces.forEach(trace => {
    const bucket = Math.floor(trace.timestamp.getTime() / (intervalMinutes * 60000)) * (intervalMinutes * 60000);
    const key = new Date(bucket).toISOString();
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(trace);
  });

  return Array.from(buckets.entries())
    .map(([timestamp, traces]) => ({
      timestamp,
      calls: traces.length,
      tokens: traces.reduce((sum, t) => sum + t.totalTokens, 0),
      cost: traces.reduce((sum, t) => sum + t.cost, 0),
      latency: traces.reduce((sum, t) => sum + t.latencyMs, 0) / traces.length,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}
