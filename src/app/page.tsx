"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  NewsDigest,
  NewsCategory,
  NewsItem,
  categoryLabels,
  categoryColors,
} from "@/types/news";

const STORAGE_KEY = "daily-news-cache";

function loadFromStorage(): NewsDigest | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NewsDigest;
    if (!parsed.items || parsed.items.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(digest: NewsDigest) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(digest));
  } catch {
    // ignore storage errors
  }
}

function mergeDigests(
  existing: NewsDigest | null,
  fresh: NewsDigest
): NewsDigest {
  if (!existing) return fresh;

  const existingIds = new Set(existing.items.map((i) => i.id));
  const mergedItems = [...existing.items];

  for (const item of fresh.items) {
    if (!existingIds.has(item.id)) {
      mergedItems.push(item);
      existingIds.add(item.id);
    }
  }

  mergedItems.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Keep top 100 items in local cache
  const trimmed = mergedItems.slice(0, 100);

  return {
    ...fresh,
    items: trimmed,
    topStories: trimmed.slice(0, 3),
  };
}

// Safari-safe date formatting
const formatFetchedAt = (iso: string | undefined): string => {
  if (!iso) return "未知";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "未知";
  try {
    return d.toLocaleString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return d.toISOString().slice(0, 19).replace("T", " ");
  }
};

export default function HomePage() {
  const [digest, setDigest] = useState<NewsDigest | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (currentDigest: NewsDigest | null) => {
    setIsRefreshing(true);
    setError(null);
    try {
      const url = `/api/news?_=${Date.now()}`;
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      const json = await res.json();
      if (json.success) {
        const merged = mergeDigests(currentDigest, json.data);
        setDigest(merged);
        saveToStorage(merged);
      } else {
        setError(json.error || "获取新闻失败");
      }
    } catch (e) {
      setError("网络错误: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // 1. 先读本地缓存，瞬间显示
    const cached = loadFromStorage();
    if (cached) {
      setDigest(cached);
    }
    // 2. 后台静默刷新
    fetchNews(cached);
  }, [fetchNews]);

  if (!digest && error) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-full bg-[var(--color-text)] text-[var(--color-surface)] text-sm font-medium"
          >
            重试
          </button>
        </div>
      </main>
    );
  }

  if (!digest) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 24, color: "#ff0000", marginBottom: 20 }}>
          正在加载新闻数据...
        </div>
        <div style={{ fontSize: 14, color: "#666" }}>
          如果长时间未显示，请按 F12 打开控制台查看错误
        </div>
      </main>
    );
  }

  // 按分类分组
  const categoryOrder: NewsCategory[] = ["ai", "finance", "global", "deep"];
  const grouped = digest.items.reduce<Record<NewsCategory, NewsItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    { ai: [], finance: [], global: [], deep: [] }
  );

  return (
    <main className="flex-1">
      {/* 数据时间栏 */}
      <div className="sticky top-[var(--nav-height,4rem)] z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)] text-sm">
        <span className="text-[var(--color-text-muted)]">
          数据获取时间：{formatFetchedAt(digest.fetchedAt)}
        </span>
        {isRefreshing && (
          <span className="text-xs text-[var(--color-text-muted)] animate-pulse">
            检查更新中...
          </span>
        )}
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* 分类新闻 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {categoryOrder.map((cat) => {
          const items = grouped[cat];
          if (items.length === 0) return null;
          const color = categoryColors[cat];

          return (
            <section key={cat}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1.5 h-8 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                  {categoryLabels[cat]}
                </h2>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {items.length} 条
                </span>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-text-muted)] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {item.category}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {item.source}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[var(--color-text)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                      {item.summary}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
            每日简报推送
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto mb-8">
            每天早晨 8 点自动推送精选 AI & 投资要闻至飞书，不错过任何重要动态
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-text)] text-[var(--color-surface)] text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              配置推送
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
