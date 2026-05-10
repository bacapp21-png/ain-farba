import { useRef } from "react";
import { useUpload } from "@workspace/object-storage-web";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label = "الصورة (اختياري)" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: (response) => {
      const url = `/api/storage${response.objectPath}`;
      onChange(url);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (inputRef.current) inputRef.current.value = "";
    await uploadFile(file);
  };

  const handleClear = () => onChange("");

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
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
            onClick={handleClear}
            className="absolute top-2 left-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg h-32 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          {isUploading ? (
            <>
              <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">جارٍ الرفع... {progress}%</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">اضغط لرفع صورة من جهازك</p>
              <Button type="button" size="sm" variant="outline" className="gap-1 h-7 text-xs">
                <Upload className="h-3 w-3" />
                اختر صورة
              </Button>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">أو أدخل رابطاً مباشراً</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="text-sm"
        disabled={isUploading}
      />
    </div>
  );
}
