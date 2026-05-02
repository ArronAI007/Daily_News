"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Zap, Globe, BookOpen } from "lucide-react";
import { NewsItem, NewsCategory, categoryLabels } from "@/types/news";
import { NewsCard } from "./NewsCard";

interface CategoryGridProps {
  news: NewsItem[];
}

const categoryConfig: {
  key: NewsCategory;
  icon: React.ReactNode;
  accent: string;
}[] = [
  { key: "ai", icon: <Zap className="w-4 h-4" />, accent: "var(--color-accent-ai)" },
  { key: "finance", icon: <BookOpen className="w-4 h-4" />, accent: "var(--color-accent-finance)" },
  { key: "global", icon: <Globe className="w-4 h-4" />, accent: "var(--color-accent-global)" },
  { key: "deep", icon: <Newspaper className="w-4 h-4" />, accent: "var(--color-accent-deep)" },
];

export function CategoryGrid({ news }: CategoryGridProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "all">("all");

  const filtered =
    activeCategory === "all" ? news : news.filter((item) => item.category === activeCategory);

  const grouped = categoryConfig.map((cat) => ({
    ...cat,
    items: news.filter((item) => item.category === cat.key).slice(0, 3),
  }));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text)]">
            分类浏览
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            按兴趣领域筛选今日要闻
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeCategory === "all"
                ? "bg-[var(--color-text)] text-[var(--color-surface)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            全部
          </button>
          {categoryConfig.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeCategory === cat.key
                  ? "text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
              style={
                activeCategory === cat.key ? { backgroundColor: cat.accent } : undefined
              }
            >
              {cat.icon}
              {categoryLabels[cat.key]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeCategory === "all" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {grouped.map((group) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: group.accent }}
                >
                  {group.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-[var(--color-text)]">
                  {categoryLabels[group.key]}
                </h3>
                <div className="flex-1 h-px bg-[var(--color-border)] ml-2" />
              </div>
              <div className="space-y-3">
                {group.items.map((item, i) => (
                  <NewsCard key={item.id} news={item} index={i} variant="compact" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filtered.map((item, i) => (
            <NewsCard key={item.id} news={item} index={i} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
