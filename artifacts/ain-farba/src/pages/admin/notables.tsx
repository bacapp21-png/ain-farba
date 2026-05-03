import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import {
  useListNotables,
  useCreateNotable,
  useUpdateNotable,
  useDeleteNotable,
  getListNotablesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { specialtyTranslations } from "@/lib/translations";

type Specialty = "scholar" | "jurist" | "poet" | "writer" | "thinker";

interface NotableForm {
  name: string;
  role: string;
  bio: string;
  specialty: Specialty;
  era: string;
  imageUrl: string;
}

const emptyForm = (): NotableForm => ({
  name: "",
  role: "",
  bio: "",
  specialty: "scholar",
  era: "",
  imageUrl: "",
});

const SPECIALTIES: Specialty[] = ["scholar", "jurist", "poet", "writer", "thinker"];

export default function AdminNotables() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const isNew = params.get("new") === "1";
  const editId = params.get("edit") ? Number(params.get("edit")) : null;

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: notables, isLoading } = useListNotables({});
  const createNotable = useCreateNotable();
  const updateNotable = useUpdateNotable();
  const deleteNotable = useDeleteNotable();

  const [showForm, setShowForm] = useState(isNew);
  const [editingId, setEditingId] = useState<number | null>(editId);
  const [form, setForm] = useState<NotableForm>(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editId && notables) {
      const notable = notables.find((n) => n.id === editId);
      if (notable) {
        setForm({
          name: notable.name,
          role: notable.role,
          bio: notable.bio,
          specialty: notable.specialty as Specialty,
          era: notable.era ?? "",
          imageUrl: notable.imageUrl ?? "",
        });
        setShowForm(true);
      }
    }
  }, [editId, notables]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListNotablesQueryKey({}) });

  const openNew = () => { setEditingId(null); setForm(emptyForm()); setShowForm(true); };

  const openEdit = (notable: NonNullable<typeof notables>[number]) => {
    setEditingId(notable.id);
    setForm({
      name: notable.name,
      role: notable.role,
      bio: notable.bio,
      specialty: notable.specialty as Specialty,
      era: notable.era ?? "",
      imageUrl: notable.imageUrl ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role || !form.bio) return;
    setSaving(true);
    const payload = { ...form, era: form.era || null, imageUrl: form.imageUrl || null };
    try {
      if (editingId) {
        await updateNotable.mutateAsync({ id: editingId, data: payload });
        toast({ title: "تم تحديث العَلَم بنجاح" });
      } else {
        await createNotable.mutateAsync({ data: payload });
        toast({ title: "تمت إضافة العَلَم بنجاح" });
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
      await deleteNotable.mutateAsync({ id: deleteId });
      toast({ title: "تم حذف العَلَم" });
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
          <h1 className="text-2xl font-serif font-bold text-primary">إدارة الأعلام</h1>
          <p className="text-sm text-muted-foreground mt-1">{notables?.length ?? 0} عَلَم مسجل</p>
        </div>
        <Button onClick={openNew} className="gap-2" data-testid="button-add-notable">
          <Plus className="h-4 w-4" />
          إضافة عَلَم
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : notables?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">لا يوجد أعلام بعد</p>
            <Button onClick={openNew} className="gap-2 mt-4"><Plus className="h-4 w-4" />إضافة عَلَم</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notables?.map((notable) => (
            <Card key={notable.id} className="border-border/60 hover:border-primary/20 transition-colors">
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-foreground">{notable.name}</p>
                    <Badge variant="secondary" className="text-xs shrink-0">{specialtyTranslations[notable.specialty]}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{notable.role}{notable.era ? ` · ${notable.era}` : ""}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(notable)} className="h-8 w-8" data-testid={`button-edit-notable-${notable.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(notable.id)} className="h-8 w-8 text-destructive hover:text-destructive" data-testid={`button-delete-notable-${notable.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={(o) => { if (!o) setShowForm(false); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-primary">{editingId ? "تعديل العَلَم" : "إضافة عَلَم جديد"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>الاسم الكامل *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الاسم الكامل" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>المنصب / الدور *</Label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="مثال: عالم دين وفقيه" />
              </div>
              <div className="space-y-1">
                <Label>التخصص *</Label>
                <Select value={form.specialty} onValueChange={(v) => setForm({ ...form, specialty: v as Specialty })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((s) => (
                      <SelectItem key={s} value={s}>{specialtyTranslations[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>السيرة الذاتية *</Label>
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="نبذة عن حياة العَلَم وإسهاماته..." rows={5} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>الحقبة الزمنية (اختياري)</Label>
                <Input value={form.era} onChange={(e) => setForm({ ...form, era: e.target.value })} placeholder="مثال: القرن العشرون" />
              </div>
              <div className="space-y-1">
                <Label>رابط الصورة (اختياري)</Label>
                <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={saving || !form.name || !form.role || !form.bio} data-testid="button-save-notable">
              {saving ? "جارٍ الحفظ..." : editingId ? "تحديث" : "إضافة العَلَم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف العَلَم</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا العَلَم؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
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
