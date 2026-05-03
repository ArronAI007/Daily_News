import Link from "next/link";
import { Newspaper } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-text)] flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-[var(--color-surface)]" />
            </div>
            <div>
              <span className="font-serif text-lg font-semibold text-[var(--color-text)]">
                Daily Brief
              </span>
              <p className="text-xs text-[var(--color-text-muted)]">
                为 AI 从业者和投资者精选每日要闻
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
            <Link href="/" className="hover:text-[var(--color-text)] transition-colors">
              首页
            </Link>
            <Link href="/settings" className="hover:text-[var(--color-text)] transition-colors">
              推送设置
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] text-center">
          Daily Brief — 仅供个人学习使用
        </div>
      </div>
    </footer>
  );
}
