import { ImageResponse } from "next/og";

// Home-screen icon when someone adds the site to their phone's home screen.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7c3aed",
          color: "white",
          fontSize: 120,
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          borderRadius: 36,
        }}
      >
        R
      </div>
    ),
    size
  );
}
