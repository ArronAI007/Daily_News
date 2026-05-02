"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Tag } from "lucide-react";
import { NewsItem, categoryLabels, categoryColors } from "@/types/news";

interface NewsCardProps {
  news: NewsItem;
  index?: number;
  variant?: "default" | "compact";
}

export function NewsCard({ news, index = 0, variant = "default" }: NewsCardProps) {
  const isCompact = variant === "compact";

  return (
    <motion.a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group block"
    >
      <div
        className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-text-muted)] transition-all duration-300 hover:shadow-lg hover:shadow-black/5 ${
          isCompact ? "p-4" : "p-5 md:p-6"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: categoryColors[news.category] }}
              >
                {categoryLabels[news.category]}
              </span>
              {!isCompact && (
                <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {news.readTime} 分钟
                </span>
              )}
            </div>

            <h3
              className={`font-serif font-semibold text-[var(--color-text)] leading-snug group-hover:text-[var(--color-accent)] transition-colors ${
                isCompact ? "text-base mb-1.5" : "text-lg md:text-xl mb-2.5"
              }`}
            >
              {news.title}
            </h3>

            {!isCompact && (
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 mb-4">
                {news.summary}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-muted)]">{news.source}</span>
                {!isCompact && news.tags.length > 0 && (
                  <div className="hidden sm:flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-[var(--color-text-muted)]" />
                    {news.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
