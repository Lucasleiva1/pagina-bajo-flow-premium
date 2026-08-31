"use client";

import Image from "next/image";
import { useRef } from "react";

type SocialCardProps = {
  label: string;
  handle: string;
  href: string;
  icon: string;
};

export function SocialCard({ label, handle, href, icon }: SocialCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(event: React.PointerEvent<HTMLAnchorElement>) {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--y", `${event.clientY - rect.top}px`);
  }

  return (
    <a
      className="social-card"
      href={href}
      onPointerMove={handleMove}
      ref={ref}
      rel="noreferrer"
      target="_blank"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="social-icon"
        height={128}
        src={`/images/social/${icon}.png`}
        width={128}
      />
      <strong>{label}</strong>
      <small>{handle}</small>
    </a>
  );
}
