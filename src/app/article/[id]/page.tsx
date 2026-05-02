import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Clock, Tag, Share2 } from "lucide-react";
import { fetchNews } from "@/lib/news";
import { categoryLabels, categoryColors } from "@/types/news";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const digest = await fetchNews();
    return digest.items.map((item) => ({ id: item.id }));
  } catch {
    return [];
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const digest = await fetchNews();
  const article = digest.items.find((item) => item.id === id);

  if (!article) {
    notFound();
  }

  const related = digest.items
    .filter((item) => item.category === article.category && item.id !== article.id)
    .slice(0, 3);

  return (
    <main className="flex-1">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: categoryColors[article.category] }}
            >
              {categoryLabels[article.category]}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {article.source}
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text)] leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} 分钟阅读
            </span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString("zh-CN")}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-[var(--color-text-secondary)] leading-relaxed mb-10"
        >
          <p className="text-xl text-[var(--color-text)] font-medium mb-6">
            {article.summary}
          </p>
          <p>
            （此处为新闻正文占位。接入真实新闻源后，将展示完整文章内容。）
          </p>
          <p>
            当前展示的是基于 {article.source} 的精选摘要。你可以点击下方按钮访问来源网站获取更多详情。
          </p>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-8">
          <Tag className="w-4 h-4 text-[var(--color-text-muted)]" />
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-12">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-text)] text-[var(--color-surface)] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" />
            阅读原文
          </a>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-text-muted)] transition-colors"
          >
            <Share2 className="w-4 h-4" />
            分享
          </button>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-[var(--color-border)] pt-8"
          >
            <h2 className="font-serif text-xl font-semibold text-[var(--color-text)] mb-4"
            >
              相关阅读
            </h2>
            <div className="space-y-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/${item.id}`}
                  className="block p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-text-muted)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: categoryColors[item.category] }}
                    />
                    <span className="text-xs text-[var(--color-text-muted)]"
                    >
                      {item.source}
                    </span>
                  </div>
                  <h3 className="font-medium text-[var(--color-text)] text-sm leading-snug"
                  >
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
