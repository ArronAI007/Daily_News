export type NewsCategory = "ai" | "finance" | "global" | "deep";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  category: NewsCategory;
  publishedAt: string;
  imageUrl?: string;
  tags: string[];
  readTime?: number;
}

export interface NewsDigest {
  date: string;
  items: NewsItem[];
  topStories: NewsItem[];
  marketSnapshot?: MarketSnapshot;
}

export interface MarketSnapshot {
  indices: {
    name: string;
    value: number;
    change: number;
    changePercent: number;
  }[];
  lastUpdated: string;
}

export const categoryLabels: Record<NewsCategory, string> = {
  ai: "AI & 科技",
  finance: "投资 & 市场",
  global: "全球热点",
  deep: "深度长文",
};

export const categoryColors: Record<NewsCategory, string> = {
  ai: "var(--color-accent-ai)",
  finance: "var(--color-accent-finance)",
  global: "var(--color-accent-global)",
  deep: "var(--color-accent-deep)",
};
