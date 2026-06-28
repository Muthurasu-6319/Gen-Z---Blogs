"use client";

import { useEffect, useState } from "react";

interface AdSenseProps {
  slotId: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: boolean;
}

export function AdSense({ slotId, className = "", format = "auto", responsive = true }: AdSenseProps) {
  const [isAdEnabled] = useState(false); // Toggle this to true to enable ads
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isAdEnabled) return;

    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (err) {
      console.error("AdSense error:", err);
      setError(true);
    }
  }, [isAdEnabled]);

  if (!isAdEnabled) {
    return (
      <div className={`bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-dashed rounded-lg flex items-center justify-center text-slate-400 text-sm p-4 min-h-[100px] ${className}`}>
        Ad Placeholder ({slotId})
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your publisher ID
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
