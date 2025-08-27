import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Juli-Camper | Campervan mieten Würzburg | CamperLife Deutschland",
  description: "Campervan mieten ab 80€/Tag in Würzburg. Träume erleben und verwirklichen mit unserem selbstausgebauten Wohnmobil. CamperLife für ganz Deutschland - Camper mieten, Vanlife, Wohnmobil.",
  keywords: "Campervan mieten, Wohnmobil mieten, Camper mieten Würzburg, Vanlife Deutschland, CamperLife, Wohnmobil Würzburg, Campervan Deutschland, Van mieten, Camping Würzburg",
  openGraph: {
    title: "Juli-Camper | Campervan mieten Würzburg | CamperLife Deutschland",
    description: "Campervan mieten ab 80€/Tag in Würzburg. Träume erleben und verwirklichen mit unserem selbstausgebauten Wohnmobil.",
    type: "website",
    locale: "de_DE",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
