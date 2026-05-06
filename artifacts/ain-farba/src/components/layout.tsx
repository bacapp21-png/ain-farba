import { useState } from "react";
import { Link, useLocation } from "wouter";
import logoUrl from "@assets/739de7c1-721e-4183-b50a-44381f45706f_1777679936172.jpeg";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/articles", label: "المقالات" },
  { href: "/events", label: "الفعاليات" },
  { href: "/notables", label: "أعلام المنطقة" },
  { href: "/about", label: "عن التجمع" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          {/* الشعار + الروابط مجمّعان على اليمين (أول عنصر → يمين في RTL) */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group" onClick={() => setMenuOpen(false)}>
              <div className="relative overflow-hidden rounded-full h-12 w-12 border-2 border-primary/20 group-hover:border-primary transition-colors">
                <img src={logoUrl} alt="شعار التجمع المحلي لشباب عين فربة" className="object-cover w-full h-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl text-primary leading-tight">التجمع المحلي</span>
                <span className="text-sm text-muted-foreground font-medium">لشباب عين فربة</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-semibold transition-colors hover:text-primary ${
                    location === link.href ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* زر القائمة — يسار الشاشة على الهاتف (ثاني عنصر → يسار في RTL) */}
          <button
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-md text-primary hover:bg-primary/10 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="فتح القائمة"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t bg-background/98 shadow-lg">
            <nav className="container mx-auto px-4 py-3 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-4 text-lg font-semibold border-b border-border/40 last:border-0 transition-colors ${
                    location === link.href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {location === link.href && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary ml-2 mb-0.5" />
                  )}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="bg-primary text-primary-foreground border-t border-primary-border py-12 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full p-1 h-16 w-16 flex items-center justify-center">
              <img src={logoUrl} alt="الشعار" className="h-14 w-14 rounded-full object-cover" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl mb-1">وحدة • ثقافة • بناء</h3>
              <p className="text-primary-foreground/80">التجمع المحلي لشباب عين فربة</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <p className="opacity-90">حفظ الذاكرة الثقافية لمنطقة عين فربة، موريتانيا</p>
            <p className="text-sm opacity-70">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
            <Link href="/admin/login" className="text-xs opacity-30 hover:opacity-60 transition-opacity mt-1">
              لوحة الإدارة
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
