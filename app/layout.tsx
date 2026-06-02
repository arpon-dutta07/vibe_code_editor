import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { ThemeProvider } from "@/components/providers/theme-providers";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { BootGate } from "@/components/ui/boot-gate";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

/* Very thin display face for the loader counter (swap for a real @font-face if you
   have the Goga file). */
const counterFont = Inter({
  subsets: ["latin"],
  weight: "300",
  variable: "--font-counter",
})

export const metadata: Metadata = {
  title: "Vibecoder - Editor",
  description: "Vibecoder - Editor - Code Editor For VibeCoders is a free online code editor that lets you write, debug, and run your code in the browser. It is an open source editor that is easy to use and has a simple interface. It is also a great way to learn programming and get started with coding.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${counterFont.variable} ${poppins.className} antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <BootGate>
              <SmoothScroll>
                <div className="flex flex-col min-h-screen">
                  <Toaster />
                  <div className="flex-1">{children}</div>
                </div>
              </SmoothScroll>
            </BootGate>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

