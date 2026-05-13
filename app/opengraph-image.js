import { ImageResponse } from "next/og";

// Social-share preview image. Shown whenever this URL is pasted into Twitter,
// LinkedIn, Slack, iMessage, WhatsApp, Discord, etc. Generated at build time.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Rachel Rios — Life & Business Coach";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Georgia, serif",
          background:
            "linear-gradient(135deg, #f5f3ff 0%, #ffffff 50%, #fce7f3 100%)",
        }}
      >
        {/* Label */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#7c3aed",
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          ✦ Certified Life & Business Coach
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: 96,
            color: "#111827",
            lineHeight: 1.05,
            marginBottom: 36,
            fontWeight: 400,
          }}
        >
          Transform Your{" "}
          <span style={{ color: "#7c3aed", fontStyle: "italic", marginLeft: 16 }}>
            Life
          </span>
          .
        </div>

        {/* Sub */}
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#374151",
            fontWeight: 400,
          }}
        >
          Rachel Rios
        </div>

        {/* URL */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#9ca3af",
            marginTop: 12,
          }}
        >
          rachelrios.com
        </div>
      </div>
    ),
    size
  );
}
