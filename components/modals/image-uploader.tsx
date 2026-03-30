"use client"

import { useRef, useState } from "react"
import { ImagePlus, X, GripVertical, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedImage {
  id:      string
  file:    File
  preview: string
  name:    string
  size:    number
}

interface Props {
  images:    UploadedImage[]
  onChange:  (images: UploadedImage[]) => void
  maxImages?: number
}

export type { UploadedImage }

export function ImageUploader({ images, onChange, maxImages = 8 }: Props) {
  const inputRef    = useRef<HTMLInputElement>(null)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const addFiles = (files: FileList | null) => {
    if (!files) return
    setError("")

    const remaining = maxImages - images.length
    if (remaining <= 0) {
      setError(`Хамгийн ихдээ ${maxImages} зураг оруулах боломжтой`)
      return
    }

    const allowed   = Array.from(files).slice(0, remaining)
    const invalid   = allowed.filter(f => !f.type.startsWith("image/"))
    if (invalid.length > 0) { setError("Зөвхөн зургийн файл оруулна уу"); return }

    const tooBig = allowed.filter(f => f.size > 5 * 1024 * 1024)
    if (tooBig.length > 0) { setError("Зураг тус бүр 5MB-аас бага байх ёстой"); return }

    const newImages: UploadedImage[] = allowed.map(file => ({
      id:      crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      name:    file.name,
      size:    file.size,
    }))

    onChange([...images, ...newImages])
  }

  const remove = (id: string) => {
    const img = images.find(i => i.id === id)
    if (img) URL.revokeObjectURL(img.preview)
    onChange(images.filter(i => i.id !== id))
    setError("")
  }

  const setCover = (id: string) => {
    const reordered = [
      ...images.filter(i => i.id === id),
      ...images.filter(i => i.id !== id),
    ]
    onChange(reordered)
  }

  // Drag sort
  const handleDragStart = (id: string) => setDragOver(id)
  const handleDropOn = (targetId: string) => {
    if (!dragOver || dragOver === targetId) { setDragOver(null); return }
    const from  = images.findIndex(i => i.id === dragOver)
    const to    = images.findIndex(i => i.id === targetId)
    const reordered = [...images]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    onChange(reordered)
    setDragOver(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">
          Зурагнууд
          <span className="text-destructive ml-1">*</span>
        </label>
        <span className={cn(
          "text-xs font-medium",
          images.length >= maxImages ? "text-destructive" : "text-muted-foreground"
        )}>
          {images.length} / {maxImages}
        </span>
      </div>

      {/* Drop zone */}
      {images.length < maxImages && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all",
            dragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border/60 hover:border-primary/50 hover:bg-muted/40"
          )}
        >
          <div className={cn(
            "p-3 rounded-full transition-colors",
            dragging ? "bg-primary/10" : "bg-muted"
          )}>
            <ImagePlus className={cn("h-5 w-5", dragging ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              {dragging ? "Зургийг энд тавина уу" : "Зураг нэмэх"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Дарах эсвэл чирж оруулах • PNG, JPG, WEBP • Тус бүр 5MB хүртэл
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => addFiles(e.target.files)}
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
              draggable
              onDragStart={() => handleDragStart(img.id)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDropOn(img.id)}
              onClick={() => setCover(img.id)}
              className={cn(
                "relative group aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
                idx === 0
                  ? "border-primary shadow-md shadow-primary/20 col-span-2 row-span-2"
                  : "border-border/60 hover:border-primary/40",
                dragOver === img.id && "border-primary/60 scale-95"
              )}
            >
              <img
                src={img.preview}
                alt={img.name}
                className="w-full h-full object-cover"
              />

              {/* Cover badge */}
              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground shadow">
                  НҮҮР
                </div>
              )}

              {/* Drag handle */}
              <div className="absolute top-1.5 right-7 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-0.5 rounded bg-black/50 cursor-grab">
                  <GripVertical className="h-3 w-3 text-white" />
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={e => { e.stopPropagation(); remove(img.id) }}
                className="absolute top-1.5 right-1.5 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
              >
                <X className="h-3 w-3" />
              </button>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              {/* Size info */}
              <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[9px] text-white bg-black/50 rounded px-1 truncate text-center">
                  {(img.size / 1024).toFixed(0)}KB
                </p>
              </div>
            </div>
          ))}

          {/* Add more slot */}
          {images.length < maxImages && images.length > 0 && (
            <div
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-border/60 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-all"
            >
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          💡 Эхний зураг нүүр зураг болно • Зургийг чирж эрэмбийг өөрчлөх боломжтой • Дарахад нүүр зураг болгоно
        </p>
      )}
    </div>
  )
}