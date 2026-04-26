"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  hidden?: boolean;
};

export default function StickyMobileCta({ hidden = false }: Props) {
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    if (hidden) return;

    const update = () => {
      ticking.current = false;
      const docHeight = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;
      // Threshold: >30% of total document height per Part 1 #8
      setVisible(docHeight > 0 && scrollY > docHeight * 0.3);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div className="sticky-mobile-cta" aria-hidden={!visible}>
      <a
        href="/signup?source=sticky-mobile"
        className="btn btn-p sticky-mobile-cta-btn"
      >
        Start Free — Take the Diagnostic →
      </a>
    </div>
  );
}
