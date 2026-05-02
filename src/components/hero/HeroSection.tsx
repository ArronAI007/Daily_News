"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { NewsItem, categoryLabels, categoryColors } from "@/types/news";

interface HeroSectionProps {
  topStories: NewsItem[];
}

export function HeroSection({ topStories }: HeroSectionProps) {
  if (topStories.length === 0) return null;

  const mainStory = topStories[0];
  const sideStories = topStories.slice(1, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Main Hero */}
        <motion.a
          href={mainStory.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 group block"
        >
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center opacity-50">
                <span className="text-4xl font-serif text-[var(--color-text-muted)]">
                  {mainStory.category === "ai" ? "AI" : mainStory.category === "finance" ? "$" : "G"}
                </span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: categoryColors[mainStory.category] }}
                >
                  {categoryLabels[mainStory.category]}
                </span>
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mainStory.readTime} 分钟阅读
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-4xl font-bold text-white leading-tight mb-3 group-hover:underline decoration-2 underline-offset-4">
                {mainStory.title}
              </h1>
              <p className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-2">
                {mainStory.summary}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-white/60 text-xs">{mainStory.source}</span>
                <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </motion.a>

        {/* Side Stories */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {sideStories.map((story, index) => (
            <motion.a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="group block flex-1"
            >
              <div className="h-full rounded-xl overflow-hidden bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: categoryColors[story.category] }}
                    />
                    <span className="text-xs font-medium text-[var(--color-text-muted)]">
                      {categoryLabels[story.category]}
                    </span>
                  </div>
                  <h2 className="font-serif text-lg md:text-xl font-semibold text-[var(--color-text)] leading-snug mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                    {story.title}
                  </h2>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                    {story.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-text-muted)]">{story.source}</span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
