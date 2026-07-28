import { useRef, useState } from "react";
import { ImageIcon, X, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/storage";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

async function requestUploadUrl(file: File): Promise<{ uploadURL: string; objectPath: string }> {
  const res = await fetch("/api/storage/uploads/request-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
  });
  if (!res.ok) throw new Error("فشل في طلب رابط الرفع");
  return res.json();
}

async function uploadToSignedUrl(uploadURL: string, file: File): Promise<void> {
  const res = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error("فشل في رفع الصورة");
}

export function ImageUploader({ value, onChange, label = "الصورة (اختياري)" }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected
    e.target.value = "";

    setUploading(true);
    setUploadError(null);
    try {
      const { uploadURL, objectPath } = await requestUploadUrl(file);
      await uploadToSignedUrl(uploadURL, file);
      onChange(objectPath);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "حدث خطأ أثناء الرفع");
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = getImageUrl(value);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Hidden file input */}
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
            src={displayUrl}
            alt="معاينة الصورة"
            className="w-full h-40 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
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

      {/* Upload area (shown when no value) */}
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

      {/* Upload button when value exists (replace) */}
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

      {uploadError && (
        <p className="text-xs text-destructive">{uploadError}</p>
      )}

      {/* URL fallback */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">أو أدخل رابطاً مباشراً:</p>
        <Input
          value={value.startsWith("/objects/") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="text-sm"
          disabled={uploading}
        />
      </div>
    </div>
  );
}
