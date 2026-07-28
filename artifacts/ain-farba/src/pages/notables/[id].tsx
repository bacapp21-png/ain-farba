import { useParams } from "wouter";
import { useGetNotable, getGetNotableQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { specialtyTranslations } from "@/lib/translations";
import { getImageUrl } from "@/lib/storage";
import { BookOpen } from "lucide-react";

export default function NotableDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id, 10) : 0;

  const { data: notable, isLoading, error } = useGetNotable(id, {
    query: { enabled: !!id, queryKey: getGetNotableQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/3 aspect-[3/4] rounded-xl" />
          <div className="w-full md:w-2/3">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !notable) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">تعذر تحميل الصفحة</h2>
        <p className="text-muted-foreground">قد تكون الشخصية غير موجودة.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
        
        <div className="w-full md:w-2/5 lg:w-1/3 bg-muted relative min-h-[400px]">
          {notable.imageUrl ? (
            <img src={getImageUrl(notable.imageUrl)} alt={notable.name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary/30">
               <span className="text-9xl font-serif font-bold">{notable.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="w-full md:w-3/5 lg:w-2/3 p-8 md:p-12 flex flex-col">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-accent/20 text-accent-foreground font-bold rounded-full text-sm">
              {specialtyTranslations[notable.specialty] || notable.specialty}
            </span>
            {notable.era && (
              <span className="px-3 py-1 border border-primary/20 text-primary font-medium rounded-full text-sm">
                {notable.era}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 leading-tight">
            {notable.name}
          </h1>
          
          <h2 className="text-xl font-bold text-muted-foreground mb-8">
            {notable.role}
          </h2>

          <div className="flex items-center gap-2 mb-4 text-primary font-bold text-lg border-b pb-2">
            <BookOpen className="w-5 h-5" />
            <h3>السيرة الذاتية</h3>
          </div>
          
          <div className="prose prose-lg prose-stone max-w-none text-foreground leading-relaxed flex-1">
            {notable.bio.split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}