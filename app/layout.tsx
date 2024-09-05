import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "投资101",
  description: "投资笔记",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
          {children}
      <div className="fixed bottom-6 right-6 p-2 m-4 hover:rounded-full hover:border-2 hover:border-black">
        <Link href="/" title="首页"><img src="home.png" alt="Home" className="w-8 h-8" /></Link>
      </div>
      </body>
      <GoogleAnalytics gaId="G-T6XCEVZ96P" />
    </html>
  );
}
