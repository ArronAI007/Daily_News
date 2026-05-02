import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-serif text-6xl md:text-8xl font-bold text-[var(--color-text)] mb-4">
          404
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8">
          页面未找到
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-text)] text-[var(--color-surface)] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </div>
    </main>
  );
}
