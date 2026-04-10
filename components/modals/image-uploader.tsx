"use client";

import { useRef, useState, useCallback } from "react";
import { ImagePlus, X, GripVertical, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  id: string;
  preview: string;
  url: string; // ← Cloudinary URL
  public_id: string; // ← Cloudinary public_id (устгахад хэрэгтэй)
  name: string;
  size: number;
  uploading?: boolean;
}

interface Props {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 8 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const uploadToCloud = async (files: File[]): Promise<UploadedImage[]> => {
  const formData = new FormData()
  
  // ← Энэ мөрийг шалгах — бүх файл нэмэгдэж байгаа эсэх
  files.forEach(f => formData.append("images", f))
  
  console.log("Uploading files:", files.length)  // ← нэмэх

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/images`, {
    method:      "POST",
    credentials: "include",
    body:        formData,
  })

  if (!res.ok) throw new Error("Upload амжилтгүй")

  const data = await res.json()
  console.log("Upload response:", data)  // ← нэмэх

  return files.map((file, i) => ({
    id:        crypto.randomUUID(),
    preview:   data.urls[i].url,
    url:       data.urls[i].url,
    public_id: data.urls[i].public_id,
    name:      file.name,
    size:      file.size,
  }))
}

  const addFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      setError("");

      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setError(`Хамгийн ихдээ ${maxImages} зураг оруулах боломжтой`);
        return;
      }

      const allowed = Array.from(files).slice(0, remaining);
      const invalid = allowed.filter((f) => !f.type.startsWith("image/"));
      if (invalid.length > 0) {
        setError("Зөвхөн зургийн файл оруулна уу");
        return;
      }
      const tooBig = allowed.filter((f) => f.size > 5 * 1024 * 1024);
      if (tooBig.length > 0) {
        setError("Зураг тус бүр 5MB-аас бага байх ёстой");
        return;
      }

      // ← Placeholder ID-уудыг урьдчилан үүсгэх
      const placeholderIds = allowed.map(() => crypto.randomUUID());

      const placeholders: UploadedImage[] = allowed.map((file, i) => ({
        id: placeholderIds[i],
        preview: URL.createObjectURL(file),
        url: "",
        public_id: "",
        name: file.name,
        size: file.size,
        uploading: true,
      }));

      // ← withPlaceholders-г хадгалах
      const withPlaceholders = [...images, ...placeholders];
      onChange(withPlaceholders);

      try {
        const uploaded = await uploadToCloud(allowed);
        console.log("Uploaded:", uploaded.length, "files");

        // ← withPlaceholders ашиглан placeholder-уудыг солих
        onChange(
          withPlaceholders.map((img) => {
            const idx = placeholderIds.indexOf(img.id);
            if (idx === -1) return img; // placeholder биш → хэвээр
            return {
              ...uploaded[idx],
              id: img.id,
            };
          }),
        );
      } catch (err) {
        setError("Upload амжилтгүй. Дахин оролдоно уу.");
        // ← Placeholder-уудыг устгаж анхны images руу буцах
        onChange(images);
      }
    },
    [images, maxImages, onChange],
  );

  const remove = async (img: UploadedImage) => {
    // Cloudinary-с устгах
    if (img.public_id) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/image`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: img.public_id }),
        });
      } catch (err) {
        console.error("Зураг устгах алдаа:", err);
      }
    }
    if (img.preview.startsWith("blob:")) URL.revokeObjectURL(img.preview);
    onChange(images.filter((i) => i.id !== img.id));
    setError("");
  };

  const setCover = (id: string) => {
    onChange([
      ...images.filter((i) => i.id === id),
      ...images.filter((i) => i.id !== id),
    ]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDropOn = (targetId: string) => {
    if (!dragOver || dragOver === targetId) {
      setDragOver(null);
      return;
    }
    const from = images.findIndex((i) => i.id === dragOver);
    const to = images.findIndex((i) => i.id === targetId);
    const reordered = [...images];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onChange(reordered);
    setDragOver(null);
  };

  const isUploading = images.some((i) => i.uploading);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">
          Зурагнууд <span className="text-destructive">*</span>
        </label>
        <span
          className={cn(
            "text-xs font-medium",
            images.length >= maxImages
              ? "text-destructive"
              : "text-muted-foreground",
          )}
        >
          {images.length} / {maxImages}
        </span>
      </div>

      {/* Drop zone */}
      {images.length < maxImages && (
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all",
            isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            dragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border/60 hover:border-primary/50 hover:bg-muted/40",
          )}
        >
          <div
            className={cn(
              "p-3 rounded-full transition-colors",
              dragging ? "bg-primary/10" : "bg-muted",
            )}
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            ) : (
              <ImagePlus
                className={cn(
                  "h-5 w-5",
                  dragging ? "text-primary" : "text-muted-foreground",
                )}
              />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              {isUploading
                ? "Зураг upload хийж байна..."
                : dragging
                  ? "Зургийг энд тавина уу"
                  : "Зураг нэмэх"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Дарах эсвэл чирж оруулах • PNG, JPG, WEBP • 5MB хүртэл
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable={!img.uploading}
              onDragStart={() => setDragOver(img.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropOn(img.id)}
              onClick={() => !img.uploading && setCover(img.id)}
              className={cn(
                "relative group aspect-square rounded-xl overflow-hidden border-2 transition-all",
                idx === 0
                  ? "border-primary shadow-md col-span-2 row-span-2"
                  : "border-border/60 hover:border-primary/40",
                img.uploading ? "cursor-wait" : "cursor-pointer",
                dragOver === img.id && "border-primary/60 scale-95",
              )}
            >
              <img
                src={img.preview}
                alt={img.name}
                className={cn(
                  "w-full h-full object-cover",
                  img.uploading && "opacity-50",
                )}
              />

              {/* Uploading spinner */}
              {img.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              )}

              {/* Cover badge */}
              {idx === 0 && !img.uploading && (
                <div className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground shadow">
                  НҮҮР
                </div>
              )}

              {/* Remove */}
              {!img.uploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(img);
                  }}
                  className="absolute top-1.5 right-1.5 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              )}

              {/* Size info */}
              {!img.uploading && (
                <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[9px] text-white bg-black/50 rounded px-1 truncate text-center">
                    {(img.size / 1024).toFixed(0)}KB
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Add more */}
          {images.length < maxImages && images.length > 0 && (
            <div
              onClick={() => !isUploading && inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-border/60 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-all"
            >
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      {images.length > 0 && !isUploading && (
        <p className="text-xs text-muted-foreground">
          💡 Эхний зураг нүүр зураг • Чирж эрэмбийг өөрчлөх • Дарахад нүүр
          болгоно
        </p>
      )}
    </div>
  );
}
