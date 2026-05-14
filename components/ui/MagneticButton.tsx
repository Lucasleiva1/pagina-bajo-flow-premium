"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRef } from "react";

type MagneticButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
  icon?: ReactNode;
};

export function MagneticButton({ children, icon, variant = "primary", ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(event: React.PointerEvent<HTMLAnchorElement>) {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.setProperty("--mx", `${x}px`);
    element.style.setProperty("--my", `${y}px`);
    element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  }

  function handleLeave() {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--mx", "0px");
    element.style.setProperty("--my", "0px");
    element.style.transform = "";
  }

  return (
    <a
      {...props}
      className={`magnetic-button ${variant === "ghost" ? "ghost" : ""} ${props.className ?? ""}`}
      onPointerLeave={handleLeave}
      onPointerMove={handleMove}
      ref={ref}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
