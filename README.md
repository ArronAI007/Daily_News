# Daily Brief

AI & Investment News Aggregator — 实时 AI 与投资要闻聚合站。

## Features

- **实时 RSS 聚合**：36氪、钛媒体、雷峰网、IT之家
- **智能分类**：AI、投资、全球热点、深度长文
- **即时更新**：每次刷新页面获取最新新闻（SSR 实时渲染）
- **行情快照**：上证指数、纳斯达克、比特币等关键指标
- **飞书推送**：每日自动推送精选要闻

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS + Framer Motion
- Cheerio (RSS 解析)
- Vercel (部署平台)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Step 1: Import Project

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Add New Project
3. Select `Daily_News` repository
4. Vercel auto-detects Next.js — leave all settings default
5. Click **Deploy**

### Step 2: Custom Domain (`daily.news.com`)

1. Go to Vercel Dashboard → Select your project → **Settings** → **Domains**
2. Enter `daily.news.com` and click **Add**
3. Vercel will show you the required DNS records

### Step 3: Configure DNS

Go to your domain registrar (where you bought `daily.news.com`) and add one of the following:

**Option A — A Record (Recommended)**

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |

**Option B — CNAME Record**

| Type | Name | Value |
|------|------|-------|
| CNAME | `@` | `cname.vercel-dns.com` |

> **Note**: Some registrars don't allow CNAME on root domain. Use A record in that case.

### Step 4: Verify

1. Wait 5-10 minutes for DNS propagation
2. Vercel Dashboard will show a green checkmark ✅ next to your domain
3. SSL certificate is auto-provisioned by Vercel (HTTPS works immediately)
4. Visit `https://daily.news.com` — your site is live

### Step 5: Auto-Deployment

Every push to `main` branch automatically triggers a new deployment. No manual steps needed.

## Environment Variables

Configure in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `RSS_CACHE_TTL_MS` | RSS fetch cache duration (ms) | `60000` |

## API

- `GET /api/news` — Fetch latest news digest (real-time)
- `POST /api/push/feishu` — Send news to Feishu webhook
