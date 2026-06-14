"use client";

import { useEffect } from "react";

// Screen 7 output — the rehearsal evaluation.
// The cinematic "vital signs" visual lives as a self-contained static asset in
// /public so the Three.js + scroll choreography runs untouched. This route
// frames it full-bleed and handles the two CTAs it posts back:
//   - record-take  → start another rehearsal round
//   - lock-pitch   → advance to Screen 8 (Privacy Receipt)
export default function EvaluatePage() {
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.type === "pitchrotator:lock-pitch") {
        // TODO: route to Screen 8 once /privacy-receipt exists.
        window.location.assign("/privacy-receipt");
      }
      if (event.data?.type === "pitchrotator:record-take") {
        // TODO: route back to Screen 7 capture once it exists.
        window.location.reload();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      title="Pitch Vital Signs — Evaluation"
      src="/evaluate-vital-signs.html"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
      }}
    />
  );
}
