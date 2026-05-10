import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import {
  useListEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  getListEventsQueryKey,
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
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { eventStatusTranslations, formatDate } from "@/lib/translations";
import { ImageUploader } from "@/components/image-uploader";

type EventStatus = "upcoming" | "past";

interface EventForm {
  title: string;
  description: string;
  date: string;
  location: string;
  status: EventStatus;
  imageUrl: string;
}

const emptyForm = (): EventForm => ({
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  location: "",
  status: "upcoming",
  imageUrl: "",
});

export default function AdminEvents() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const isNew = params.get("new") === "1";
  const editId = params.get("edit") ? Number(params.get("edit")) : null;

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: events, isLoading } = useListEvents({});
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [showForm, setShowForm] = useState(isNew);
  const [editingId, setEditingId] = useState<number | null>(editId);
  const [form, setForm] = useState<EventForm>(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editId && events) {
      const event = events.find((e) => e.id === editId);
      if (event) {
        setForm({
          title: event.title,
          description: event.description,
          date: new Date(event.date).toISOString().split("T")[0],
          location: event.location,
          status: event.status as EventStatus,
          imageUrl: event.imageUrl ?? "",
        });
        setShowForm(true);
      }
    }
  }, [editId, events]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListEventsQueryKey({}) });

  const openNew = () => { setEditingId(null); setForm(emptyForm()); setShowForm(true); };

  const openEdit = (event: NonNullable<typeof events>[number]) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
      location: event.location,
      status: event.status as EventStatus,
      imageUrl: event.imageUrl ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.location) return;
    setSaving(true);
    const payload = { ...form, imageUrl: form.imageUrl || null, date: new Date(form.date).toISOString() };
    try {
      if (editingId) {
        await updateEvent.mutateAsync({ id: editingId, data: payload });
        toast({ title: "تم تحديث الفعالية بنجاح" });
      } else {
        await createEvent.mutateAsync({ data: payload });
        toast({ title: "تمت إضافة الفعالية بنجاح" });
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
      await deleteEvent.mutateAsync({ id: deleteId });
      toast({ title: "تم حذف الفعالية" });
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
          <h1 className="text-2xl font-serif font-bold text-primary">إدارة الفعاليات</h1>
          <p className="text-sm text-muted-foreground mt-1">{events?.length ?? 0} فعالية مسجلة</p>
        </div>
        <Button onClick={openNew} className="gap-2" data-testid="button-add-event">
          <Plus className="h-4 w-4" />
          فعالية جديدة
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : events?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">لا توجد فعاليات بعد</p>
            <Button onClick={openNew} className="gap-2 mt-4"><Plus className="h-4 w-4" />إضافة فعالية</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {events?.map((event) => (
            <Card key={event.id} className="border-border/60 hover:border-primary/20 transition-colors">
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-foreground truncate">{event.title}</p>
                    <Badge variant={event.status === "upcoming" ? "default" : "secondary"} className="text-xs shrink-0">
                      {eventStatusTranslations[event.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                    <span>·</span>
                    <span>{formatDate(event.date.toString())}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(event)} className="h-8 w-8" data-testid={`button-edit-event-${event.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(event.id)} className="h-8 w-8 text-destructive hover:text-destructive" data-testid={`button-delete-event-${event.id}`}>
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
            <DialogTitle className="font-serif text-xl text-primary">{editingId ? "تعديل الفعالية" : "فعالية جديدة"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>العنوان *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="عنوان الفعالية" />
            </div>
            <div className="space-y-1">
              <Label>الوصف *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف الفعالية..." rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>التاريخ *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>الحالة</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as EventStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">قادمة</SelectItem>
                    <SelectItem value="past">منتهية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>المكان *</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="مكان انعقاد الفعالية" />
            </div>
            <ImageUploader
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              label="صورة الفعالية (اختياري)"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.description || !form.location} data-testid="button-save-event">
              {saving ? "جارٍ الحفظ..." : editingId ? "تحديث" : "إضافة الفعالية"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الفعالية</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذه الفعالية؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
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
