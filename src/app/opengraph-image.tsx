import { ImageResponse } from "next/og";

import { shareImageAlt, shareTitle, siteDescription } from "@/lib/metadata";

export const alt = shareImageAlt;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          width: "100%",
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgb(255,255,255) 0%, rgb(247,250,252) 100%)",
          color: "rgb(15, 23, 42)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(10,102,194,0.18), transparent 38%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 52,
            left: 52,
            display: "flex",
            borderRadius: 999,
            border: "1px solid rgba(148, 163, 184, 0.24)",
            background: "rgba(255, 255, 255, 0.78)",
            padding: "14px 22px",
            fontSize: 26,
            color: "rgb(71, 85, 105)",
          }}
        >
          AI Concierge designs
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
            padding: "64px 56px 52px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 98,
              maxWidth: 860,
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 84,
                lineHeight: 1.02,
                fontWeight: 700,
                letterSpacing: "-0.05em",
              }}
            >
              {shareTitle}
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 760,
                fontSize: 32,
                lineHeight: 1.3,
                color: "rgb(71, 85, 105)",
              }}
            >
              {siteDescription}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              fontSize: 24,
              color: "rgb(100, 116, 139)",
            }}
          >
            <div style={{ display: "flex", gap: 20 }}>
              <div
                style={{
                  display: "flex",
                  borderRadius: 999,
                  background: "rgba(10,102,194,0.10)",
                  padding: "10px 18px",
                  color: "rgb(3, 105, 161)",
                }}
              >
                Hiring
              </div>
              <div
                style={{
                  display: "flex",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.78)",
                  padding: "10px 18px",
                }}
              >
                Premium
              </div>
            </div>
            <div style={{ display: "flex" }}>Design preview</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
