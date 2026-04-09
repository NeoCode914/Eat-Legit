interface VideoPreviewProps {
  previewUrl: string | null;
}

export default function VideoPreview({ previewUrl }: VideoPreviewProps) {
  if (!previewUrl) return null;

  return (
    <div className="mt-6 w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
      <video
        autoPlay
        controls
        loop
        muted
        src={previewUrl}
        className="h-auto w-full object-cover"
        aria-label="Uploaded video preview"
      />
    </div>
  );
}
