# PRD: OpenClaw Command Center MVP

## 概要
- **プロジェクト名**: OpenClaw Command Center
- **目的**: AI assistant（OpenClaw）の運用状態を一元管理するダッシュボード
- **プラットフォーム**: PWA

## 技術スタック
- **フレームワーク**: Next.js 16 (App Router)
- **スタイリング**: Tailwind CSS 4
- **デプロイ**: Vercel

## 機能要件

### P0（MVP）
1. **セッション監視**
   - main/worker agentの稼働状態
   - トークン使用率（0-100%）
   - 最終活動時刻

2. **メモリ監視**
   - 作業ログ最終更新時刻
   - 30分以上更新なし → 警告
   - 1時間以上更新なし → アラート

3. **タスク管理**
   - TODO.md の未完了タスク表示
   - HEARTBEAT.md チェック結果

4. **デプロイ状況**
   - 最新デプロイ（Vercel）
   - GitHub push状況
   - リポジトリ一覧

### P1
5. **リアルタイム更新**（30秒ごと）
6. **Supermemory統計**
7. **Langfuse LLMトレース連携**

## UI/UX要件
- **ダークモード対応**
- **レスポンシブ**（モバイル対応）
- **カード型レイアウト**
- **ステータスバッジ**（正常🟢/警告🟡/エラー🔴）
- **リアルタイム自動更新**

## データソース
- `/home/clawd/ebi/memory/YYYY-MM-DD.md` → 作業ログ
- `/home/clawd/ebi/TODO.md` → タスク
- `/home/clawd/ebi/HEARTBEAT.md` → チェック項目
- OpenClaw session API（将来）
