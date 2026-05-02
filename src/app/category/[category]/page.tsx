import { notFound } from "next/navigation";
import { fetchNewsByCategory } from "@/lib/news";
import { NewsCategory, categoryLabels, categoryColors } from "@/types/news";
import { NewsCard } from "@/components/news-card/NewsCard";

const validCategories: NewsCategory[] = ["ai", "finance", "global", "deep"];

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!validCategories.includes(category as NewsCategory)) {
    notFound();
  }

  const cat = category as NewsCategory;
  const news = await fetchNewsByCategory(cat);

  return (
    <main className="flex-1">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-3 h-10 rounded-full"
            style={{ backgroundColor: categoryColors[cat] }}
          />
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              {categoryLabels[cat]}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              共 {news.length} 条相关新闻
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map((item, i) => (
            <NewsCard key={item.id} news={item} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
