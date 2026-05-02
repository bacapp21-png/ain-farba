import { useParams } from "wouter";
import { useGetEvent, getGetEventQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { eventStatusTranslations, formatDate } from "@/lib/translations";
import { Calendar, MapPin, Info } from "lucide-react";

export default function EventDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id, 10) : 0;

  const { data: event, isLoading, error } = useGetEvent(id, {
    query: { enabled: !!id, queryKey: getGetEventQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-64 w-full mb-8 rounded-xl" />
        <Skeleton className="h-12 w-3/4 mb-6" />
        <Skeleton className="h-20 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-5/6 mb-4" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">تعذر تحميل الفعالية</h2>
        <p className="text-muted-foreground">قد تكون الفعالية غير موجودة أو تم حذفها.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {event.imageUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden aspect-[21/9] border shadow-md">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="bg-card border rounded-2xl p-8 shadow-sm">
        <div className="mb-4 inline-block px-3 py-1 bg-accent/20 text-accent-foreground font-bold rounded-full text-sm">
          {eventStatusTranslations[event.status] || event.status}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-8 leading-tight">
          {event.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 p-6 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">التاريخ</p>
              <p className="font-bold text-lg">{formatDate(event.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">المكان</p>
              <p className="font-bold text-lg">{event.location}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4 text-primary font-bold text-xl border-b pb-2">
            <Info className="w-6 h-6" />
            <h2>تفاصيل الفعالية</h2>
          </div>
          <div className="prose prose-lg md:prose-xl prose-stone max-w-none text-foreground leading-relaxed">
            {event.description.split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}