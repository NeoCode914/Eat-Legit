import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/axios";
import type { PresignResponse } from "../types";
import Navbar from "../components/Navbar";
import {
  Upload,
  Film,
  CheckCircle2,
  XCircle,
  Loader2,
  FileVideo,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import axios from "axios";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description too long"),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

// ─── Upload States ────────────────────────────────────────────────────────────

type UploadStage = "idle" | "uploading" | "success" | "error";

// ─── Component ────────────────────────────────────────────────────────────────

export default function UploadVideo() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
  });

  // ── File selection handler ────────────────────────────────────────────
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) {
      setErrorMessage("Only video files are allowed.");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setErrorMessage("File size must be under 500MB.");
      return;
    }
    setErrorMessage("");
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadStage("idle");
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  // ── Upload handler ────────────────────────────────────────────────────
  const onSubmit = useCallback(
    async (values: UploadFormValues) => {
      if (!selectedFile) {
        setErrorMessage("Please select a video file.");
        return;
      }

      setUploadStage("uploading");
      setUploadProgress(0);
      setErrorMessage("");

      try {
        // Step 1: Get presigned URL from backend
        const { data: presignData } = await api.post<PresignResponse>("/api/food", {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        });

        setUploadProgress(30);

        // Step 2: Upload directly to R2 storage via presigned URL
        await axios.put(presignData.signedUrl, selectedFile, {
          headers: { "Content-Type": selectedFile.type },
          onUploadProgress: (evt) => {
            if (evt.total) {
              const pct = Math.round((evt.loaded / evt.total) * 70) + 30;
              setUploadProgress(pct);
            }
          },
        });

        // Step 3: Save video metadata to backend
        await api.post("/api/food/video", {
          videoUrl: presignData.publicUrl,
          title: values.title,
          description: values.description,
        });

        setUploadProgress(100);
        console.log("Uploaded:", presignData.publicUrl, values);
        setUploadStage("success");
      } catch (err) {
        let msg = "Upload failed. Please try again.";
        if (axios.isAxiosError(err)) {
          msg = (err.response?.data as { error?: string })?.error ?? err.message;
        }
        setErrorMessage(msg);
        setUploadStage("error");
      }
    },
    [selectedFile]
  );

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadStage("idle");
    setUploadProgress(0);
    setErrorMessage("");
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [reset]);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />

      <div className="pt-20 pb-12 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/feed")}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Go back to feed"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">Upload a Reel</h1>
            <p className="text-white/40 text-sm">Share your food story with the world</p>
          </div>
        </div>

        {/* Success State */}
        {uploadStage === "success" && (
          <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-10 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-white text-xl font-bold">Reel uploaded! 🎉</h2>
              <p className="text-white/50 text-sm">
                Your video is live and visible to food lovers.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/feed")}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                View Feed
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-colors cursor-pointer"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}

        {/* Upload Form */}
        {uploadStage !== "success" && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Video Drop Zone + Preview */}
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  id="video-file-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleInputChange}
                />

                {!selectedFile ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label="Select video file"
                    onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click(); }}
                    className={`relative w-full aspect-9/16 max-h-[60vh] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-200 select-none ${isDragOver
                        ? "border-orange-400 bg-orange-500/10 scale-[1.01]"
                        : "border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5"
                      }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500/20 to-rose-500/20 flex items-center justify-center">
                      <Film size={28} className={isDragOver ? "text-orange-400" : "text-white/40"} />
                    </div>
                    <div className="text-center space-y-1.5 px-6">
                      <p className="text-white font-semibold text-sm">
                        {isDragOver ? "Drop to upload" : "Drag & drop your video"}
                      </p>
                      <p className="text-white/40 text-xs">
                        or click to browse • MP4, MOV, WebM up to 500MB
                      </p>
                    </div>
                    <div className="px-5 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold flex items-center gap-1.5">
                      <Upload size={12} />
                      Choose File
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full aspect-9/16 max-h-[60vh] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl">
                    <video
                      src={previewUrl ?? undefined}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                    />
                    {/* File info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                      <div className="flex items-center gap-2.5">
                        <FileVideo size={14} className="text-orange-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-white text-xs font-medium truncate">{selectedFile.name}</p>
                          <p className="text-white/40 text-[10px]">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Change button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm text-white/70 text-xs font-medium hover:text-white transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                )}

                {errorMessage && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <XCircle size={15} className="text-red-400 shrink-0" />
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}
              </div>

              {/* Right: Form Fields */}
              <div className="space-y-5">
                <div className="p-6 rounded-3xl bg-white/3 border border-white/8 space-y-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-orange-400" />
                    <span className="text-white font-semibold text-sm">Reel Details</span>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label htmlFor="upload-title" className="text-white/70 text-sm font-medium">
                      Title
                    </label>
                    <input
                      id="upload-title"
                      type="text"
                      placeholder="e.g. Crispy Butter Chicken Recipe"
                      {...register("title")}
                      aria-invalid={!!errors.title}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-orange-500/60 transition-all duration-200"
                    />
                    {errors.title && (
                      <p className="text-red-400 text-xs">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label htmlFor="upload-description" className="text-white/70 text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="upload-description"
                      rows={5}
                      placeholder="Describe the dish, ingredients, restaurant story..."
                      {...register("description")}
                      aria-invalid={!!errors.description}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-orange-500/60 transition-all duration-200 resize-none"
                    />
                    {errors.description && (
                      <p className="text-red-400 text-xs">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                {uploadStage === "uploading" && (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70 flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin text-orange-400" />
                        Uploading...
                      </span>
                      <span className="text-orange-400 font-semibold tabular-nums">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-orange-500 to-rose-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Tips */}
                {uploadStage === "idle" && (
                  <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/15 space-y-3">
                    <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest">
                      Tips for great reels
                    </p>
                    {[
                      "Shoot vertically (9:16 ratio) for best results",
                      "Keep it under 60 seconds for higher engagement",
                      "Show the food close up — people eat with their eyes!",
                    ].map((tip) => (
                      <div key={tip} className="flex items-start gap-2 text-white/50 text-xs">
                        <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                        {tip}
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit */}
                <button
                  id="upload-submit-btn"
                  type="submit"
                  disabled={uploadStage === "uploading" || !selectedFile}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-orange-500/25 cursor-pointer"
                >
                  {uploadStage === "uploading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Publish Reel
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
