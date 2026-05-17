type ResponsiveVideoProps = {
  autoPlay?: boolean;
  className?: string;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  name: string;
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
  loop = true,
  muted = true,
  name,
  playsInline = true,
  poster = true,
  preload = "metadata",
}: ResponsiveVideoProps) {
  return (
    <video
      autoPlay={autoPlay}
      className={className}
      controls={controls}
      loop={loop}
      muted={muted}
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
