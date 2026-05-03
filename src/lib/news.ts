import {
  fetchAllNews,
  fetchNewsByCategoryFromRss,
} from "./rss";
import { NewsItem, NewsDigest, MarketSnapshot, NewsCategory } from "@/types/news";

const marketSnapshot: MarketSnapshot = {
  indices: [
    { name: "上证指数", value: 3320.45, change: 45.32, changePercent: 1.38 },
    { name: "恒生指数", value: 21890.12, change: 312.56, changePercent: 1.45 },
    { name: "纳斯达克", value: 18450.23, change: -125.4, changePercent: -0.67 },
    { name: "标普 500", value: 5820.15, change: -18.3, changePercent: -0.31 },
    { name: "比特币", value: 82340.0, change: -1560.0, changePercent: -1.86 },
    { name: "布伦特原油", value: 95.4, change: 3.2, changePercent: 3.47 },
  ],
  lastUpdated: new Date().toISOString(),
};

export async function fetchNews(): Promise<NewsDigest> {
  const items = await fetchAllNews();

  return {
    date: new Date().toISOString().slice(0, 10),
    items,
    topStories: items.slice(0, 3),
    marketSnapshot,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchNewsByCategory(category: NewsCategory): Promise<NewsItem[]> {
  return fetchNewsByCategoryFromRss(category);
}

export async function fetchMarketSnapshot(): Promise<MarketSnapshot> {
  return marketSnapshot;
}
