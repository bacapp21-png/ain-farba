import { useState } from "react";
import { Link } from "wouter";
import { useListArticles } from "@workspace/api-client-react";
import { ListArticlesCategory } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryTranslations, formatDate } from "@/lib/translations";
import { Button } from "@/components/ui/button";

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState<ListArticlesCategory | undefined>();
  const { data: articles, isLoading } = useListArticles(
    activeCategory ? { category: activeCategory } : {}
  );

  const categories = Object.values(ListArticlesCategory);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">المقالات والمخطوطات</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          تصفح أرشيفنا من المقالات الثقافية، التاريخية، والأدبية المتعلقة بمنطقة عين فربة.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Button
          variant={!activeCategory ? "default" : "outline"}
          onClick={() => setActiveCategory(undefined)}
          className="rounded-full px-6"
        >
          الكل
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className="rounded-full px-6"
          >
            {categoryTranslations[category] || category}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 hover:border-primary/40 group bg-card">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {categoryTranslations[article.category] || article.category}
                    </span>
                    <span className="text-sm text-muted-foreground">{formatDate(article.createdAt)}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight font-serif">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-1">
                    {article.summary}
                  </p>
                  <div className="text-sm font-medium mt-auto border-t pt-4">
                    بقلم: <span className="text-primary">{article.author}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed border-primary/20">
          <p className="text-xl text-muted-foreground">لا توجد مقالات في هذا القسم حالياً.</p>
        </div>
      )}
    </div>
  );
}