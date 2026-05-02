import { Suspense } from "react";
import { fetchNews } from "@/lib/news";
import { HeroSection } from "@/components/hero/HeroSection";
import { MarketTicker } from "@/components/hero/MarketTicker";
import { CategoryGrid } from "@/components/news-card/CategoryGrid";

function LoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-[var(--color-surface-elevated)] rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-48 bg-[var(--color-surface-elevated)] rounded-xl" />
          <div className="h-48 bg-[var(--color-surface-elevated)] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const digest = await fetchNews();

  return (
    <main className="flex-1">
      <Suspense fallback={<LoadingFallback />}>
        <HeroSection topStories={digest.topStories} />
        {digest.marketSnapshot && <MarketTicker snapshot={digest.marketSnapshot} />}
        <CategoryGrid news={digest.items} />
      </Suspense>

      {/* Daily Digest CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
            每日简报推送
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto mb-8">
            每天早晨 8 点自动推送精选 AI & 投资要闻至飞书，不错过任何重要动态
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/settings"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-text)] text-[var(--color-surface)] text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              配置推送
            </a>
            <span className="text-xs text-[var(--color-text-muted)]">
              支持飞书 / 钉钉 / 企业微信
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
