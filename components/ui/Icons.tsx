type IconProps = {
  className?: string;
};

export function ArrowIcon({ className = "" }: IconProps) {
  return <span className={`icon arrow-icon ${className}`} aria-hidden="true" />;
}

export function SparkIcon({ className = "" }: IconProps) {
  return <span className={`icon spark-icon ${className}`} aria-hidden="true" />;
}

export function ChevronIcon({ className = "" }: IconProps) {
  return <span className={`icon chevron-icon ${className}`} aria-hidden="true" />;
}

export function SocialGlyph({ type }: { type: string }) {
  return <span className={`social-glyph ${type}`} aria-hidden="true" />;
}
