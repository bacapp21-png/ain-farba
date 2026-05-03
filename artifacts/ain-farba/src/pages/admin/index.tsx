import { Link } from "wouter";
import { useGetSummaryStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Users, TrendingUp, Plus, ArrowLeft } from "lucide-react";
import { categoryTranslations, specialtyTranslations, formatDate } from "@/lib/translations";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetSummaryStats();
  const { data: activity } = useGetRecentActivity();

  const statCards = [
    { title: "المقالات", value: stats?.totalArticles, icon: BookOpen, href: "/admin/articles", color: "text-primary" },
    { title: "الفعاليات", value: stats?.totalEvents, icon: Calendar, href: "/admin/events", color: "text-amber-600" },
    { title: "الأعلام", value: stats?.totalNotables, icon: Users, href: "/admin/notables", color: "text-emerald-700" },
    { title: "فعاليات قادمة", value: stats?.upcomingEvents, icon: TrendingUp, href: "/admin/events", color: "text-blue-600" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-1">إدارة محتوى موقع ذاكرة عين فربة</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ title, value, icon: Icon, href, color }) => (
          <Link key={href + title} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/60 hover:border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {isLoading ? "—" : (value ?? 0)}
                </p>
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-primary">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/admin/articles?new=1">
            <Button className="gap-2" data-testid="button-new-article">
              <Plus className="h-4 w-4" />
              مقالة جديدة
            </Button>
          </Link>
          <Link href="/admin/events?new=1">
            <Button variant="outline" className="gap-2" data-testid="button-new-event">
              <Plus className="h-4 w-4" />
              فعالية جديدة
            </Button>
          </Link>
          <Link href="/admin/notables?new=1">
            <Button variant="outline" className="gap-2" data-testid="button-new-notable">
              <Plus className="h-4 w-4" />
              إضافة عَلَم
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent content */}
      {activity && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-serif text-lg text-primary">آخر المقالات</CardTitle>
              <Link href="/admin/articles">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground h-8">
                  <span className="text-xs">عرض الكل</span>
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.recentArticles.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">لا توجد مقالات بعد</p>
              )}
              {activity.recentArticles.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-2 py-2 border-b border-border/40 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.author} · {categoryTranslations[a.category]}</p>
                  </div>
                  <Link href={`/admin/articles?edit=${a.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0">تعديل</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-serif text-lg text-primary">آخر الأعلام</CardTitle>
              <Link href="/admin/notables">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground h-8">
                  <span className="text-xs">عرض الكل</span>
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.recentNotables.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">لا يوجد أعلام بعد</p>
              )}
              {activity.recentNotables.map((n) => (
                <div key={n.id} className="flex items-start justify-between gap-2 py-2 border-b border-border/40 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{n.name}</p>
                    <p className="text-xs text-muted-foreground">{n.role} · {specialtyTranslations[n.specialty]}</p>
                  </div>
                  <Link href={`/admin/notables?edit=${n.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0">تعديل</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
