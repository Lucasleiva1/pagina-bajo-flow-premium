"use client";

import { useEffect, useRef } from "react";

type ResponsiveVideoProps = {
  autoPlay?: boolean;
  className?: string;
  controls?: boolean;
  isPlaying?: boolean;
  loop?: boolean;
  muted?: boolean;
  name: string;
  onEnded?: () => void;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  playsInline?: boolean;
  poster?: boolean;
  preload?: "auto" | "metadata" | "none";
};

const videoBreakpoints = [
  { media: "(max-width: 600px)", width: 480 },
  { media: "(max-width: 900px)", width: 768 },
  { media: "(max-width: 1400px)", width: 1280 },
  { media: undefined, width: 1920 },
] as const;

export function ResponsiveVideo({
  autoPlay = true,
  className,
  controls = false,
  isPlaying = true,
  loop = false,
  muted = true,
  name,
  onEnded,
  onTimeUpdate,
  playsInline = true,
  poster = true,
  preload = "auto",
}: ResponsiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isPlaying, name]);

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      className={className}
      controls={controls}
      loop={loop}
      muted={muted}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      playsInline={playsInline}
      poster={poster ? `/videos/${name}-poster.jpg` : undefined}
      preload={preload}
    >
      {videoBreakpoints.map(({ media, width }) => (
        <source
          key={`webm-${width}`}
          media={media}
          src={`/videos/${name}-${width}.webm`}
          type="video/webm"
        />
      ))}
      {videoBreakpoints.map(({ media, width }) => (
        <source
          key={`mp4-${width}`}
          media={media}
          src={`/videos/${name}-${width}.mp4`}
          type="video/mp4"
        />
      ))}
    </video>
  );
}

