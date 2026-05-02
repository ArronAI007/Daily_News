"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { MarketSnapshot } from "@/types/news";

interface MarketTickerProps {
  snapshot: MarketSnapshot;
}

export function MarketTicker({ snapshot }: MarketTickerProps) {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 shrink-0">
            <Activity className="w-4 h-4 text-[var(--color-accent-finance)]" />
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              市场快讯
            </span>
          </div>
          <div className="flex items-center gap-6">
            {snapshot.indices.map((index, i) => (
              <motion.div
                key={index.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 shrink-0"
              >
                <span className="text-xs text-[var(--color-text-muted)]">{index.name}</span>
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {index.value.toLocaleString()}
                </span>
                <span
                  className={`text-xs font-medium flex items-center gap-0.5 ${
                    index.change >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {index.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {index.changePercent >= 0 ? "+" : ""}
                  {index.changePercent.toFixed(2)}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
