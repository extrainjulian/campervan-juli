import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "wuecamper | Campervan Community Würzburg | Crowdfunding Projekt",
  description: "Campervan Community-Projekt in Würzburg. 50€ am Tag, crowdfinanziert aufgebaut. Gemeinsam einen Van teilen und Vanlife erleben.",
  keywords: "Campervan Community, Crowdfunding Camper, Van teilen Würzburg, Vanlife Community, wuecamper, Würzburg Campervan, Community Van, Camper Crowdfunding",
  openGraph: {
    title: "wuecamper | Campervan Community Würzburg | Crowdfunding Projekt",
    description: "Campervan Community-Projekt in Würzburg. 50€ am Tag, crowdfinanziert aufgebaut. Gemeinsam einen Van teilen und Vanlife erleben.",
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
