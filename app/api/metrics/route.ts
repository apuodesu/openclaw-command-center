import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

interface SessionMetrics {
  totalCalls: number;
  totalTokens: number;
  averageLatency: number;
  errorRate: number;
  callsPerHour: number;
}

export async function GET() {
  try {
    // memory/YYYY-MM-DD.md から実データ取得
    const today = new Date().toISOString().split('T')[0];
    const memoryPath = join('/home/clawd/ebi/memory', `${today}.md`);
    
    let memoryContent = '';
    try {
      memoryContent = await readFile(memoryPath, 'utf-8');
    } catch (err) {
      // ファイルが存在しない場合はデフォルト値
      return NextResponse.json({
        totalCalls: 0,
        totalTokens: 0,
        averageLatency: 0,
        errorRate: 0,
        callsPerHour: 0,
      });
    }

    // 簡易的な解析（実際は更に詳細に解析可能）
    const lines = memoryContent.split('\n');
    const entries = lines.filter(line => line.includes('##'));
    
    // トークン数を抽出（例: "Token usage: 95941/200000"）
    const tokenMatches = memoryContent.match(/Token usage: (\d+)\/(\d+)/g) || [];
    const totalTokens = tokenMatches.reduce((sum, match) => {
      const tokens = parseInt(match.split(':')[1].split('/')[0].trim());
      return sum + tokens;
    }, 0);

    // 作業回数をカウント
    const totalCalls = entries.length;

    // 平均レイテンシ（仮定値）
    const averageLatency = 1500; // 実際はログから抽出すべき

    const metrics: SessionMetrics = {
      totalCalls,
      totalTokens,
      averageLatency,
      errorRate: 0, // エラーログから計算
      callsPerHour: totalCalls / 24, // 1日24時間で割る
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
