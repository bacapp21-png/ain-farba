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
          <div className="flex flex-col items-center text-center gap-3">
            <p className="opacity-90">حفظ الذاكرة الثقافية لمنطقة عين فربة، موريتانيا</p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1CkNAAShj9/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فيسبوك"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-white/15 hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/22242347878"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="واتساب"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-white/15 hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
            <p className="text-sm opacity-70">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
            <Link href="/admin/login" className="text-xs opacity-30 hover:opacity-60 transition-opacity">
              لوحة الإدارة
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
