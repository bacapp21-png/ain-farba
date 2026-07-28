import { useRef, useState } from "react";
import { ImageIcon, X, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary غير مُهيَّأ — يرجى إضافة VITE_CLOUDINARY_CLOUD_NAME و VITE_CLOUDINARY_UPLOAD_PRESET");
  }
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("فشل رفع الصورة على Cloudinary");
  const data = await res.json();
  return data.secure_url as string;
}

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label = "الصورة (اختياري)" }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "حدث خطأ أثناء الرفع");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
          <img
            src={value}
            alt="معاينة الصورة"
            className="w-full h-40 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 left-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload zone */}
      {!value && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg h-24 bg-muted/30 hover:bg-muted/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground">جارٍ رفع الصورة…</p>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground">اضغط لرفع صورة من جهازك</p>
            </>
          )}
        </button>
      )}

      {value && !uploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 ml-1" />
          استبدال الصورة
        </Button>
      )}

      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">أو أدخل رابطاً مباشراً:</p>
        <Input
          value={value.startsWith("https://res.cloudinary.com") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="text-sm"
          disabled={uploading}
        />
      </div>
    </div>
  );
}
