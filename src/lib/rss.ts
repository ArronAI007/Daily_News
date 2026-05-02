import { load } from "cheerio";
import { NewsItem, NewsCategory } from "@/types/news";

interface RssSource {
  name: string;
  url: string;
  defaultCategory: NewsCategory;
}

const sources: RssSource[] = [
  {
    name: "36氪",
    url: "https://36kr.com/feed",
    defaultCategory: "ai",
  },
  {
    name: "钛媒体",
    url: "https://www.tmtpost.com/rss.xml",
    defaultCategory: "finance",
  },
  {
    name: "雷峰网",
    url: "https://www.leiphone.com/feed",
    defaultCategory: "ai",
  },
  {
    name: "IT之家",
    url: "https://www.ithome.com/rss/",
    defaultCategory: "ai",
  },
];

const categoryKeywords: Record<NewsCategory, string[]> = {
  ai: [
    "AI", "人工智能", "大模型", "GPT", "ChatGPT", "OpenAI", "Claude",
    "芯片", "半导体", "自动驾驶", "机器人", "大语言模型", "LLM",
    "生成式", "神经网络", "深度学习", "NLP", "算力", "GPU",
    "豆包", "火山引擎", "智能体", "Agent", "多模态", "语音",
    "Siri", "Apple 智能", "Vision", "XR", "VR", "AR",
  ],
  finance: [
    "美元", "人民币", "股市", "基金", "投资", "市值", "财报",
    "银行", "证券", "期货", " crypto", "比特币", "以太坊",
    "降息", "加息", "美联储", "央行", "通胀", "CPI", "GDP",
    "IPO", "上市", "融资", "并购", "财报", "营收", "利润",
    "蔚来", "理想", "小鹏", "零跑", "小米汽车", "新能源",
    "关税", "贸易", "出口", "进口", "油价", "黄金",
  ],
  global: [
    "中国", "美国", "欧盟", "日本", "韩国", "印度", "俄罗斯",
    "全球", "国际", "政策", "监管", "立法", "法案",
    "地缘", "冲突", "战争", "和平", "外交", "制裁",
    "气候", "环境", "碳中和", "能源", "石油", "天然气",
    "疫情", "病毒", "健康", "公共卫生",
  ],
  deep: [
    "深度", "分析", "调研", "报告", "专访", "对话",
    "解读", "复盘", "反思", "趋势", "展望", "预测",
    "行业", "产业", "格局", "变革", "颠覆", "创新",
    "科学家", "研究员", "教授", "专家",
  ],
};

function classifyCategory(title: string, source: string): NewsCategory {
  const text = title.toLowerCase();
  let bestCategory: NewsCategory = "deep";
  let maxScore = 0;

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat as NewsCategory;
    }
  }

  if (maxScore === 0) {
    if (source === "钛媒体" || source === "36氪") {
      return "finance";
    }
    if (source === "雷峰网" || source === "IT之家") {
      return "ai";
    }
  }

  return bestCategory;
}

function extractSummary(description: string): string {
  const $ = load(description, null, false);
  let text = $.text().trim();
  text = text.replace(/\s+/g, " ").replace(/\n+/g, " ");
  if (text.length > 200) {
    text = text.slice(0, 200) + "...";
  }
  return text || "暂无摘要";
}

function generateTags(title: string, summary: string): string[] {
  const text = (title + " " + summary).toLowerCase();
  const tags: string[] = [];
  const tagMap: Record<string, string[]> = {
    AI: ["ai", "人工智能"],
    大模型: ["大模型", "llm", "gpt"],
    OpenAI: ["openai"],
    芯片: ["芯片", "半导体", "gpu"],
    汽车: ["汽车", "新能源", "电动车", "造车"],
    投资: ["投资", "融资", "上市", "ipo"],
    美股: ["美股", "纳斯达克", "标普"],
    监管: ["监管", "政策", "立法"],
    机器人: ["机器人", "optimus", "人形机器人"],
    苹果: ["苹果", "apple", "iphone", "mac"],
  };

  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some((k) => text.includes(k))) {
      tags.push(tag);
      if (tags.length >= 3) break;
    }
  }

  return tags;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<NewsItem[]>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data: data as NewsItem[], timestamp: Date.now() });
}

async function fetchRssSource(source: RssSource): Promise<NewsItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(source.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    const $ = load(xml, { xmlMode: true });
    const items: NewsItem[] = [];

    $("item").each((_, el) => {
      const title = $(el).find("title").text().trim();
      let link = $(el).find("link").text().trim();
      const pubDate = $(el).find("pubDate").text().trim();
      const description = $(el).find("description").text().trim();

      if (!title || !link) return;

      if (link.includes("<![CDATA[")) {
        link = link.replace(/<!\[CDATA\[(.*?)\]\]>/, "$1").trim();
      }

      if (title.includes("<![CDATA[")) {
        title.replace(/<!\[CDATA\[(.*?)\]\]>/, "$1").trim();
      }

      const summary = extractSummary(description);
      const category = classifyCategory(title, source.name);
      const tags = generateTags(title, summary);

      items.push({
        id: `${source.name}::${link}`,
        title,
        summary,
        source: source.name,
        url: link,
        category,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        tags,
        readTime: Math.max(3, Math.ceil(summary.length / 200)),
      });
    });

    return items.slice(0, 8);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`RSS fetch failed for ${source.name}: ${message}`);
    return [];
  }
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  const cached = getCached<NewsItem[]>("all-news");
  if (cached) return cached;

  const results = await Promise.all(sources.map((s) => fetchRssSource(s)));
  const all = results.flat();

  all.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const sliced = all.slice(0, 24);
  setCached("all-news", sliced);
  return sliced;
}

export async function fetchNewsByCategoryFromRss(category: NewsCategory): Promise<NewsItem[]> {
  const cached = getCached<NewsItem[]>(`category-${category}`);
  if (cached) return cached;

  const all = await fetchAllNews();
  const filtered = all.filter((item) => item.category === category);
  setCached(`category-${category}`, filtered);
  return filtered;
}
