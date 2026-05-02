import { useState } from "react";
import { Link } from "wouter";
import { useListEvents } from "@workspace/api-client-react";
import { ListEventsStatus } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { eventStatusTranslations, formatDate } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

export default function Events() {
  const [activeStatus, setActiveStatus] = useState<ListEventsStatus>(ListEventsStatus.upcoming);
  const { data: events, isLoading } = useListEvents({ status: activeStatus });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">الفعاليات والأحداث</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          تابع نشاطات التجمع المحلي وشارك في بناء المستقبل الثقافي للمنطقة.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <Button
          variant={activeStatus === ListEventsStatus.upcoming ? "default" : "outline"}
          onClick={() => setActiveStatus(ListEventsStatus.upcoming)}
          className="rounded-full px-8 text-lg h-12"
        >
          {eventStatusTranslations[ListEventsStatus.upcoming]}
        </Button>
        <Button
          variant={activeStatus === ListEventsStatus.past ? "default" : "outline"}
          onClick={() => setActiveStatus(ListEventsStatus.past)}
          className="rounded-full px-8 text-lg h-12"
        >
          {eventStatusTranslations[ListEventsStatus.past]}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="h-full hover:shadow-lg transition-all group overflow-hidden border-primary/20">
                <CardContent className="p-0 flex flex-col sm:flex-row h-full bg-card">
                  {event.imageUrl && (
                    <div className="w-full sm:w-1/3 aspect-video sm:aspect-auto">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors font-serif leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed flex-1">
                      {event.description}
                    </p>
                    <div className="space-y-2 mt-auto text-sm font-medium text-primary/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card max-w-3xl mx-auto rounded-xl border-2 border-dashed border-primary/20">
          <p className="text-xl text-muted-foreground">لا توجد فعاليات في هذا القسم حالياً.</p>
        </div>
      )}
    </div>
  );
}