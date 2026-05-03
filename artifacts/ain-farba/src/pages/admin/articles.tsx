import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import {
  useListArticles,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
  getListArticlesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoryTranslations, formatDate } from "@/lib/translations";

type Category = "heritage" | "history" | "literature" | "thought" | "identity";

interface ArticleForm {
  title: string;
  summary: string;
  content: string;
  author: string;
  category: Category;
  imageUrl: string;
  publishedAt: string;
}

const emptyForm = (): ArticleForm => ({
  title: "",
  summary: "",
  content: "",
  author: "",
  category: "heritage",
  imageUrl: "",
  publishedAt: new Date().toISOString().split("T")[0],
});

const CATEGORIES: Category[] = ["heritage", "history", "literature", "thought", "identity"];

export default function AdminArticles() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const isNew = params.get("new") === "1";
  const editId = params.get("edit") ? Number(params.get("edit")) : null;

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: articles, isLoading } = useListArticles({});
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [showForm, setShowForm] = useState(isNew);
  const [editingId, setEditingId] = useState<number | null>(editId);
  const [form, setForm] = useState<ArticleForm>(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editId && articles) {
      const article = articles.find((a) => a.id === editId);
      if (article) {
        setForm({
          title: article.title,
          summary: article.summary,
          content: article.content,
          author: article.author,
          category: article.category as Category,
          imageUrl: article.imageUrl ?? "",
          publishedAt: new Date(article.publishedAt).toISOString().split("T")[0],
        });
        setShowForm(true);
      }
    }
  }, [editId, articles]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListArticlesQueryKey({}) });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (article: typeof articles extends (infer T)[] | undefined ? T : never) => {
    setEditingId((article as { id: number }).id);
    setForm({
      title: (article as { title: string }).title,
      summary: (article as { summary: string }).summary,
      content: (article as { content: string }).content,
      author: (article as { author: string }).author,
      category: (article as { category: Category }).category,
      imageUrl: (article as { imageUrl?: string | null }).imageUrl ?? "",
      publishedAt: new Date((article as { publishedAt: Date | string }).publishedAt).toISOString().split("T")[0],
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content || !form.author) return;
    setSaving(true);
    const payload = {
      ...form,
      imageUrl: form.imageUrl || null,
      publishedAt: new Date(form.publishedAt).toISOString(),
    };
    try {
      if (editingId) {
        await updateArticle.mutateAsync({ id: editingId, data: payload });
        toast({ title: "تم تحديث المقالة بنجاح" });
      } else {
        await createArticle.mutateAsync({ data: payload });
        toast({ title: "تمت إضافة المقالة بنجاح" });
      }
      invalidate();
      setShowForm(false);
    } catch {
      toast({ title: "حدث خطأ", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteArticle.mutateAsync({ id: deleteId });
      toast({ title: "تم حذف المقالة" });
      invalidate();
    } catch {
      toast({ title: "حدث خطأ", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">إدارة المقالات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {articles?.length ?? 0} مقالة في المنصة
          </p>
        </div>
        <Button onClick={openNew} className="gap-2" data-testid="button-add-article">
          <Plus className="h-4 w-4" />
          مقالة جديدة
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : articles?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">لا توجد مقالات بعد</p>
            <p className="text-sm mb-6">ابدأ بإضافة أول مقالة ثقافية</p>
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة مقالة
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {articles?.map((article) => (
            <Card key={article.id} className="border-border/60 hover:border-primary/20 transition-colors">
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-foreground truncate">{article.title}</p>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {categoryTranslations[article.category]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{article.summary}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {article.author} · {formatDate(article.publishedAt.toString())}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(article)}
                    className="h-8 w-8"
                    data-testid={`button-edit-article-${article.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(article.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    data-testid={`button-delete-article-${article.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { if (!o) setShowForm(false); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-primary">
              {editingId ? "تعديل المقالة" : "مقالة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="title">العنوان *</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="عنوان المقالة" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="author">الكاتب *</Label>
                <Input id="author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="اسم الكاتب" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category">التصنيف *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{categoryTranslations[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="summary">الملخص *</Label>
              <Textarea id="summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="ملخص قصير عن المقالة" rows={2} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="content">المحتوى الكامل *</Label>
              <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="نص المقالة كاملاً..." rows={8} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="publishedAt">تاريخ النشر</Label>
                <Input id="publishedAt" type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="imageUrl">رابط الصورة (اختياري)</Label>
                <Input id="imageUrl" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.content || !form.author} data-testid="button-save-article">
              {saving ? "جارٍ الحفظ..." : editingId ? "تحديث" : "نشر المقالة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المقالة</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذه المقالة؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
