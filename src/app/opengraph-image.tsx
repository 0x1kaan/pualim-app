import { ImageResponse } from "next/og";

export const alt = "Pualım dijital sadakat kartı";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fbf7f0",
          color: "#2c1810",
          padding: 72,
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "2px solid rgba(44, 24, 16, 0.14)",
            borderRadius: 28,
            padding: 56,
            background: "rgba(255, 255, 255, 0.52)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 42, fontWeight: 700 }}>Pualım</div>
            <div style={{ fontSize: 26, color: "#6b3a2a" }}>pualim.today</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1.04 }}>
              Türk kafeler için dijital sadakat kartı
            </div>
            <div style={{ fontSize: 34, color: "#6b3a2a" }}>
              QR ile katılım, damga, ödül ve yerel bildirimler.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
