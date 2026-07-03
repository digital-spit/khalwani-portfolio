import { ImageResponse } from "next/og";

export const alt =
  "Khaled Halwani — Digital Creative Strategist. Selected work for Vans, Levi's, Gucci, Mercedes, N26 and more.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BONE = "#f3efe6";
const INK = "#0f0e0c";
const INK_SOFT = "#2a2823";
const EMBER = "#e8511d";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BONE,
          padding: "80px 88px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: EMBER,
            fontWeight: 600,
          }}
        >
          § 00 — Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -2,
              color: INK,
              lineHeight: 1.02,
            }}
          >
            Khaled Halwani
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 30,
              color: INK_SOFT,
              fontWeight: 400,
            }}
          >
            Digital Creative Strategist
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 64, height: 4, background: EMBER, marginBottom: 24 }} />
          <div
            style={{
              display: "flex",
              fontSize: 19,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: INK_SOFT,
            }}
          >
            Vans · Levi&apos;s · Gucci · Mercedes · N26 · Cadillac
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
