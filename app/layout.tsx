import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoundWave — Music for Everyone",
  description: "Stream music, discover artists, vibe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
