# 🦞 OpenClaw Command Center

AI assistant management dashboard for monitoring OpenClaw operations in real-time.

## 🌐 Live Demo

**Production:** https://openclaw-command-center-ashy.vercel.app

## 📊 Features

### Core Monitoring
- **Session Status**: Token usage, main/worker agent health
- **Memory Monitoring**: Work log update tracking, 30m/1h alerts
- **Task Management**: TODO tracking, priority-based filtering
- **Deployment Status**: Vercel/GitHub integration, deployment history

### LLM Metrics (Langfuse不要)
- **Real-time Metrics**: Total calls, average latency, token consumption
- **Trace History**: Last 20 LLM calls with model breakdown
- **Activity Chart**: 2-hour timeline of API calls and token usage
- **Performance Analysis**: Latency categorization (Fast/Normal/Slow)

### UI/UX
- ✨ Dark mode optimized
- 📱 Fully responsive (mobile-first)
- 🔄 Auto-refresh every 30s
- 🎨 Status badges (🟢 Success / 🟡 Warning / 🔴 Error)
- 🎯 Card-based layout

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript (strict mode)
- **Deployment**: Vercel
- **PWA**: Manifest + Service Worker ready

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/apuodesu/openclaw-command-center.git
cd openclaw-command-center

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔧 Configuration

Currently uses mock data for demonstration. To integrate with real OpenClaw data:

1. **Enable OpenClaw Tools** (Future implementation)
   - `sessions_list`: Fetch active sessions
   - `session_status`: Get token usage
   - `sessions_history`: Retrieve conversation history

2. **Update `lib/tracer.ts`**
   - Replace `fetchLLMTraces()` mock with real API calls

See [OpenClaw Documentation](https://docs.openclaw.ai) for API reference.

## 📝 Environment Variables

No environment variables required for the current version (uses mock data).

## 🎯 Roadmap

- [ ] Real-time OpenClaw session integration via `sessions_list` tool
- [ ] WebSocket live updates (replace 30s polling)
- [ ] Historical data persistence (last 7 days)
- [ ] Custom alert thresholds
- [ ] Export reports (CSV/JSON)
- [ ] Multi-agent comparison view

## 🤝 Contributing

PRs welcome! Please ensure:
- TypeScript strict mode compliance
- Tailwind CSS for styling (no inline styles)
- Mobile-first responsive design
- Dark mode compatibility

## 📄 License

MIT

## 🔗 Links

- **GitHub**: https://github.com/apuodesu/openclaw-command-center
- **OpenClaw Docs**: https://docs.openclaw.ai
- **Vercel Deployment**: https://openclaw-command-center-ashy.vercel.app

---

Built with ❤️ for the OpenClaw community | 🚫 Langfuse不要
