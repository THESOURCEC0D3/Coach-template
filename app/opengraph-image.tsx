import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trophy Kiprono — Speak with Confidence. Lead with Impact.";
export default function OGImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#fffcf2", fontFamily: "Georgia, serif" }}><div style={{ color: "#8f6418", fontSize: 28, marginBottom: 30 }}>TROPHY KIPRONO</div><div style={{ display: "flex", flexDirection: "column", fontSize: 78, lineHeight: 1.15, color: "#111827" }}><span>Speak with Confidence.</span><span style={{ color: "#8f6418" }}>Lead with Impact.</span></div><div style={{ marginTop: 45, color: "#4b5563", fontSize: 24 }}>Communications · Coaching · Books</div></div>, size);
}
