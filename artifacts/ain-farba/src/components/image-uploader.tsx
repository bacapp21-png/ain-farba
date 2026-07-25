import { ImageIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label = "الصورة (اختياري)" }: ImageUploaderProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value && (
        <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
          <img
            src={value}
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

      {!value && (
        <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg h-24 bg-muted/30">
          <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">أدخل رابط الصورة أدناه</p>
        </div>
      )}

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://i.ibb.co/..."
        className="text-sm"
      />
      <p className="text-xs text-muted-foreground">
        يمكنك رفع الصورة على{" "}
        <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="underline text-primary">
          imgbb.com
        </a>{" "}
        ثم نسخ الرابط المباشر هنا
      </p>
    </div>
  );
}
