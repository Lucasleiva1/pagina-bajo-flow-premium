import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Serif_Display, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-editorial-serif",
  weight: "400",
});

const bebasNeue = Bebas_Neue({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-editorial-condensed",
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-editorial-ui",
});

export const metadata: Metadata = {
  title: "Bajo Flow | Lucas Leiva",
  description: "Portfolio cinematografico premium de Lucas Leiva, editor audiovisual.",
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${dmSerifDisplay.variable} ${bebasNeue.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
