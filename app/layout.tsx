import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import Image from "next/image";
import CustomImage from "@/app/components/CustomImage";

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
        <div className="fixed bottom-2 right-2 md:bottom-6 md:right-6 md:p-2 md:m-4 p-1 m-2 hover:rounded-full hover:border-2 hover:border-black">
          <Link href="/" title="首页">
            <CustomImage 
              src="/home.png"
              alt="Home"
              width={32}
              height={32}
            />
          </Link>
        </div>
      </body>
      <GoogleAnalytics gaId="G-T6XCEVZ96P" />
    </html>
  );
}
