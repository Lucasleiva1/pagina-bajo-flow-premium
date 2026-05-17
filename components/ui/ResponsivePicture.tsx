type ResponsivePictureProps = {
  alt: string;
  basePath: string;
  className?: string;
  fallbackSrc: string;
  loading?: "eager" | "lazy";
  sizes: string;
  widths: readonly number[];
};

function buildSrcSet(basePath: string, widths: readonly number[], format: "avif" | "webp") {
  return widths.map((width) => `${basePath}-${width}.${format} ${width}w`).join(", ");
}

export function ResponsivePicture({
  alt,
  basePath,
  className,
  fallbackSrc,
  loading = "lazy",
  sizes,
  widths,
}: ResponsivePictureProps) {
  return (
    <picture className={className}>
      <source sizes={sizes} srcSet={buildSrcSet(basePath, widths, "avif")} type="image/avif" />
      <source sizes={sizes} srcSet={buildSrcSet(basePath, widths, "webp")} type="image/webp" />
      <img alt={alt} decoding="async" loading={loading} sizes={sizes} src={fallbackSrc} />
    </picture>
  );
}
