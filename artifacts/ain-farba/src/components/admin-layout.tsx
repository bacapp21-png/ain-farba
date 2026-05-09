import { Link, useLocation } from "wouter";
import { useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Users, LayoutDashboard, LogOut, Globe } from "lucide-react";
import logoUrl from "@assets/2d137bf4-fcec-4423-89e3-894b9e8e6144_1778318301241.jpeg";

const navLinks = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/articles", label: "المقالات", icon: BookOpen },
  { href: "/admin/events", label: "الفعاليات", icon: Calendar },
  { href: "/admin/notables", label: "الأعلام", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAdminAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground border-b border-primary/20 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full border border-primary-foreground/20 overflow-hidden">
              <img src={logoUrl} alt="الشعار" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg leading-none block">لوحة الإدارة</span>
              <span className="text-xs text-primary-foreground/70">شباب عين فربة</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">الموقع</span>
              </Button>
            </Link>
            <Button
              data-testid="button-logout"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-background border-l shadow-sm hidden md:flex flex-col">
          <nav className="flex flex-col gap-1 p-3 pt-6">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return (
                <Link key={href} href={href}>
                  <div
                    data-testid={`nav-admin-${href.split("/").pop() || "home"}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link key={href} href={href} className="flex-1">
                <div className={`flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
                  <Icon className="h-5 w-5" />
                  {label}
                </div>
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
