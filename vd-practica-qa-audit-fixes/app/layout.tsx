import "@/styles/globals.css";

import { fontHeading, fontSans, fontMono } from "@/assets/fonts";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import ModalProvider from "@/components/modals/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = constructMetadata();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-[#FAD6D3] font-sans antialiased text-[#83513E] p-4 md:p-8 flex justify-center",
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable,
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="w-full max-w-[1600px] bg-[#F6DFB3] rounded-[2.5rem] ring-1 ring-[#83513E]/10 shadow-[0_0_60px_rgba(242,138,161,0.15)] min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] relative overflow-clip flex flex-col">
              
              {/* Subtle Noise Texture */}
              <div 
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay"
                style={{ backgroundImage: "url('/_static/noise.svg')" }}
              />

              <div className="relative z-10 flex flex-col flex-1">
                <ModalProvider>{children}</ModalProvider>
              </div>
              <Analytics />
              <Toaster richColors closeButton />
              <TailwindIndicator />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
