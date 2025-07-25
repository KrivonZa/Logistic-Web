import type { Metadata } from "next";
import { Geist, Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import ReduxProvider from "@/app/provider";
import FCMListener from "@/components/FCMListener";
import "@goongmaps/goong-js/dist/goong-js.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"] });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flipship Management",
  description: "@2025 by Flipship",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-roboto ${montserrat.variable} font-montserrat ${geistSans.variable} antialiased`}
      >
        <TooltipProvider delayDuration={100}>
          <ReduxProvider>
            <FCMListener />
            {children}
          </ReduxProvider>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
