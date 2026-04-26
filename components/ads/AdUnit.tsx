"use client";
import { useEffect, useRef } from "react";
import { ADSENSE } from "@/config/endpoints";

declare global { interface Window { adsbygoogle: unknown[] } }

type Props = {
  slot: string;
  layout?: "in-article" | "display";
  className?: string;
};

export function AdUnit({ slot, layout = "display", className = "" }: Props) {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
    catch (e) { console.warn("AdSense push failed:", e); }
  }, []);

  if (layout === "in-article") {
    return (
      <ins
        className={`adsbygoogle ${className}`}
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE.publisherId}
        data-ad-slot={slot}
      />
    );
  }
  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE.publisherId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
