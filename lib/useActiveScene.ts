"use client";

import { useEffect, useState } from "react";

export function useActiveScene(ids: string[]) {
  const [activeScene, setActiveScene] = useState(ids[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveScene(visible.target.id);
        }
      },
      { threshold: [0.45, 0.62, 0.8] },
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [ids]);

  return activeScene;
}
