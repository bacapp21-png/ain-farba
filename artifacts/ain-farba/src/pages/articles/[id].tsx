import { useParams } from "wouter";
import { useGetArticle, getGetArticleQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryTranslations, formatDate } from "@/lib/translations";
import { getImageUrl } from "@/lib/storage";

export default function ArticleDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id, 10) : 0;

  const { data: article, isLoading, error } = useGetArticle(id, {
    query: { enabled: !!id, queryKey: getGetArticleQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Skeleton className="h-12 w-3/4 mb-6" />
        <Skeleton className="h-6 w-1/4 mb-12" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-5/6 mb-4" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">تعذر تحميل المقال</h2>
        <p className="text-muted-foreground">قد يكون المقال غير موجود أو تم حذفه.</p>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12 text-center">
        <div className="mb-6 flex justify-center items-center gap-4 text-sm font-medium">
          <span className="text-accent bg-accent/10 px-4 py-1 rounded-full">
            {categoryTranslations[article.category] || article.category}
          </span>
          <span className="text-muted-foreground">{formatDate(article.createdAt)}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">
          {article.title}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 italic">
          {article.summary}
        </p>
        <div className="inline-block border-t border-b border-primary/20 py-3 px-8 text-lg font-bold text-primary">
          بقلم: {article.author}
        </div>
      </div>

      {article.imageUrl && (
        <div className="mb-12 rounded-xl overflow-hidden aspect-video border shadow-sm">
          <img src={getImageUrl(article.imageUrl)} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-lg md:prose-xl prose-stone max-w-none text-foreground leading-relaxed">
        {article.content.split('\n').map((paragraph, index) => (
          paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
        ))}
      </div>
    </article>
  );
}