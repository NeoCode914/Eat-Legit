import { useState, useCallback, useRef } from "react";
import api from "../api/axios";
import type { PresignResponse } from "../types";
import { Upload, Film, Loader2 } from "lucide-react";
import axios from "axios";

interface UploadReelProps {
  onUploadSuccess: (url: string) => void;
}

export default function UploadReel({ onUploadSuccess }: UploadReelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setMessage("");
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setMessage("Please choose a video file.");
      return;
    }

    if (!selectedFile.type.startsWith("video/")) {
      setMessage("Only video files are allowed.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const { data } = await api.post<PresignResponse>("/api/food", {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      });

      await axios.put(data.signedUrl, selectedFile, {
        headers: { "Content-Type": selectedFile.type },
      });

      onUploadSuccess(data.publicUrl);
      setMessage("Upload successful! ✓");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(
          (err.response?.data as { error?: string })?.error ?? err.message
        );
      } else {
        setMessage("Upload failed. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, onUploadSuccess]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-white/15 bg-white/3 hover:border-orange-500/40 hover:bg-white/5 cursor-pointer transition-all duration-200"
        role="button"
        tabIndex={0}
        aria-label="Select video"
        onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click(); }}
      >
        <Film size={24} className="text-white/40" />
        <span className="text-white/50 text-sm text-center">
          {selectedFile ? selectedFile.name : "Click to select a video"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
          id="reel-file-input"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-linear-to-r from-orange-500 to-rose-500 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-lg shadow-orange-500/20"
        id="reel-upload-btn"
      >
        {isUploading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={15} />
            Upload Reel
          </>
        )}
      </button>

      {message && (
        <p
          className={`text-sm text-center ${
            message.includes("✓") ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}