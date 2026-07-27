import { useGetRecentActivity, type RecentActivity } from "@workspace/api-client-react";
import { Link } from "wouter";
import { categoryTranslations, specialtyTranslations, eventStatusTranslations, formatDate } from "@/lib/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Users, ArrowLeft, MapPin } from "lucide-react";

export default function Home() {
  const { data: activity, isLoading } = useGetRecentActivity();

  const hasArticles = (activity?.recentArticles?.length ?? 0) > 0;
  const hasNotables = (activity?.recentNotables?.length ?? 0) > 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative py-10 md:py-14 bg-primary text-primary-foreground overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, hsl(43 65% 50% / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(145 60% 25% / 0.15) 0%, transparent 50%)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
            ذاكرة عين فربة <br />
            <span className="text-accent">الثقافية والتاريخية</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            منصة متخصصة في توثيق التراث الثقافي والتاريخي، والتعريف بالمقومات السياحية، وإبراز المعالم الطبيعية والحضارية، ونشر الفكر والأدب، والتعريف بالأعلام والشخصيات البارزة بمنطقة عين فربة في موريتانيا.
          </p>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            icon={<BookOpen className="h-6 w-6" />}
            title="آخر المقالات"
            subtitle="أحدث ما نُشر في المكتبة الثقافية"
            href="/articles"
          />

          {isLoading ? (
            <LoadingGrid count={3} />
          ) : !hasArticles ? (
            <EmptyState message="لم تُنشر مقالات بعد" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activity!.recentArticles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <Card className="h-full hover:shadow-md transition-all hover:border-primary/30 group cursor-pointer">
                    <CardContent className="p-6 flex flex-col h-full">
                      <Badge variant="outline" className="self-start mb-3 text-accent border-accent/30 font-semibold">
                        {categoryTranslations[article.category] ?? article.category}
                      </Badge>
                      <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-5 line-clamp-3 leading-relaxed flex-1">
                        {article.summary}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-3 mt-auto">
                        <span className="font-medium">{article.author}</span>
                        <span>{formatDate(article.publishedAt?.toString() ?? article.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Events */}
      <RecentEvents isLoading={isLoading} activity={activity} />

      {/* Recent Notables */}
      <section className="py-16 bg-background border-t">
        <div className="container mx-auto px-4">
          <SectionHeader
            icon={<Users className="h-6 w-6" />}
            title="أعلام المنطقة"
            subtitle="نخبة من الشخصيات التي أثرت المنطقة بعلمها وفكرها"
            href="/notables"
          />

          {isLoading ? (
            <LoadingGrid count={3} height="h-40" />
          ) : !hasNotables ? (
            <EmptyState message="لم يُضف أعلام بعد" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activity!.recentNotables.map((notable) => (
                <Link key={notable.id} href={`/notables/${notable.id}`}>
                  <Card className="h-full hover:shadow-md transition-all hover:border-primary/30 group cursor-pointer">
                    <CardContent className="p-6 flex gap-4 items-start">
                      <div className="h-14 w-14 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-xl">
                        {notable.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base group-hover:text-primary transition-colors mb-1">
                          {notable.name}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">{notable.role}</p>
                        <Badge variant="secondary" className="text-xs">
                          {specialtyTranslations[notable.specialty] ?? notable.specialty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function RecentEvents({
  isLoading,
  activity,
}: {
  isLoading: boolean;
  activity: RecentActivity | undefined;
}) {
  const recentEvents = activity?.recentEvents ?? [];
  const hasEvents = recentEvents.length > 0;

  return (
    <section className="py-16 bg-muted/30 border-t border-b">
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={<Calendar className="h-6 w-6" />}
          title="الفعاليات"
          subtitle="آخر الأنشطة والفعاليات الثقافية"
          href="/events"
        />

        {isLoading ? (
          <LoadingGrid count={3} height="h-36" />
        ) : !hasEvents ? (
          <EmptyState message="لم تُضف فعاليات بعد" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="h-full hover:shadow-md transition-all hover:border-primary/30 group cursor-pointer">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant={event.status === "upcoming" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {eventStatusTranslations[event.status] ?? event.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(event.date.toString())}</span>
                    </div>
                    <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{event.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-auto pt-3 border-t">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          {icon}
          <h2 className="text-2xl md:text-3xl font-serif font-bold">{title}</h2>
        </div>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors shrink-0"
      >
        عرض الكل
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}

function LoadingGrid({ count, height = "h-56" }: { count: number; height?: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`${height} rounded-xl`} />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p>{message}</p>
    </div>
  );
}
