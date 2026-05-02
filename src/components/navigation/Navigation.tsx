"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle/ThemeToggle";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/category/ai", label: "AI & 科技" },
  { href: "/category/finance", label: "投资 & 市场" },
  { href: "/category/global", label: "全球热点" },
  { href: "/category/deep", label: "深度长文" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--color-surface)]/80 border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-text)] flex items-center justify-center transition-transform group-hover:scale-105">
              <Newspaper className="w-4 h-4 text-[var(--color-surface)]" />
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight text-[var(--color-text)]">
              Daily Brief
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              className="md:hidden w-9 h-9 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="菜单"
            >
              {mobileOpen ? (
                <X className="w-4 h-4 text-[var(--color-text-secondary)]" />
              ) : (
                <Menu className="w-4 h-4 text-[var(--color-text-secondary)]" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
