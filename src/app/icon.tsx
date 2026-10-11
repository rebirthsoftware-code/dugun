import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0a0a",
          borderRadius: 8,
        }}
      >
        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid #d4b483", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 8, height: 8, border: "1px solid #f3ede3", transform: "rotate(45deg)" }} />
        </div>
      </div>
    ),
    size,
  );
}
