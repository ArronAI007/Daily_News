import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-toggle/ThemeProvider";
import { Navigation } from "@/components/navigation/Navigation";
import { Footer } from "@/components/footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://daily.news.com"),
  title: "Daily Brief — AI & Investment News",
  description: "Curated daily news for AI practitioners and investors",
  openGraph: {
    title: "Daily Brief — AI & Investment News",
    description: "Curated daily news for AI practitioners and investors",
    type: "website",
    locale: "zh_CN",
    url: "https://daily.news.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Brief — AI & Investment News",
    description: "Curated daily news for AI practitioners and investors",
  },
  alternates: {
    canonical: "https://daily.news.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
