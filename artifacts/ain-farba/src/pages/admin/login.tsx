import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, AlertCircle } from "lucide-react";
import logoUrl from "@assets/2d137bf4-fcec-4423-89e3-894b9e8e6144_1778318301241.jpeg";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/admin");
    }
  }, [isAuthenticated, setLocation]);

  if (isAuthenticated) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      const success = login(password);
      if (success) {
        setLocation("/admin");
      } else {
        setError(true);
        setPassword("");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm shadow-xl border-primary/10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full border-2 border-primary/20 overflow-hidden">
              <img src={logoUrl} alt="الشعار" className="w-full h-full object-cover" />
            </div>
          </div>
          <CardTitle className="font-serif text-2xl text-primary">لوحة الإدارة</CardTitle>
          <CardDescription className="text-base">ذاكرة عين فربة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  data-testid="input-admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 text-right"
                  placeholder="أدخل كلمة المرور"
                  autoFocus
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-md p-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>كلمة المرور غير صحيحة</span>
              </div>
            )}

            <Button
              data-testid="button-admin-login"
              type="submit"
              className="w-full"
              disabled={loading || !password}
            >
              {loading ? "جارٍ التحقق..." : "دخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
