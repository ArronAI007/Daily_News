"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

interface NewsRefreshBarProps {
  fetchedAt: string;
}

export function NewsRefreshBar({ fetchedAt }: NewsRefreshBarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="sticky top-[var(--nav-height,4rem)] z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)] text-sm">
      <span className="text-[var(--color-text-muted)]">
        数据获取时间：{formatTime(fetchedAt)}
      </span>
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-text)] text-[var(--color-surface)] text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
        刷新
      </button>
    </div>
  );
}
