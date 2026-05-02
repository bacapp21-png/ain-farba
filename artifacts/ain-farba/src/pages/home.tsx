import { useGetSummaryStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Link } from "wouter";
import { categoryTranslations, specialtyTranslations, formatDate } from "@/lib/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Calendar, Users, Activity } from "lucide-react";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetSummaryStats();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{backgroundImage: "radial-gradient(circle at 20% 50%, hsl(43 65% 50% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(145 60% 25% / 0.2) 0%, transparent 50%)"}}></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
            ذاكرة عين فربة <br />
            <span className="text-accent">الثقافية والتاريخية</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            منصة مخصصة لتوثيق التراث، والتعريف بالأعلام، ونشر الفكر والأدب الخاص بمنطقة عين فربة في موريتانيا.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/articles" className="bg-accent text-accent-foreground px-8 py-3 rounded-md font-bold text-lg hover:bg-accent/90 transition-colors shadow-lg">
              تصفح المخطوطات والمقالات
            </Link>
            <Link href="/notables" className="bg-transparent border-2 border-primary-foreground/30 text-primary-foreground px-8 py-3 rounded-md font-bold text-lg hover:bg-primary-foreground/10 transition-colors">
              تعرف على الأعلام
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={<BookOpen />} title="المقالات" count={stats?.totalArticles} loading={statsLoading} />
            <StatCard icon={<Calendar />} title="الفعاليات" count={stats?.totalEvents} loading={statsLoading} />
            <StatCard icon={<Users />} title="الأعلام" count={stats?.totalNotables} loading={statsLoading} />
            <StatCard icon={<Activity />} title="فعاليات قادمة" count={stats?.upcomingEvents} loading={statsLoading} />
          </div>
        </div>
      </section>

      {/* Recent Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-2">أحدث الإضافات</h2>
              <p className="text-muted-foreground text-lg">اكتشف آخر ما تمت إضافته للمكتبة الرقمية</p>
            </div>
            <Link href="/articles" className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-2">
              عرض الكل
            </Link>
          </div>

          {activityLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activity?.recentArticles.slice(0, 3).map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <Card className="h-full hover:shadow-md transition-all hover:border-primary/30 group bg-card">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="text-xs font-bold text-accent mb-3 uppercase tracking-wider">
                        {categoryTranslations[article.category] || article.category}
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-1">
                        {article.summary}
                      </p>
                      <div className="text-sm text-primary/70 font-medium mt-auto border-t pt-4 flex justify-between">
                        <span>{article.author}</span>
                        <span>{formatDate(article.createdAt)}</span>
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

function StatCard({ icon, title, count, loading }: { icon: React.ReactNode, title: string, count?: number, loading: boolean }) {
  return (
    <Card className="bg-card border-none shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-foreground">{count}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}