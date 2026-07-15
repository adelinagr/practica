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
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn(
          "min-h-screen bg-[#4A3B40] font-sans antialiased text-foreground p-4 md:p-8 flex justify-center",
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable,
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="w-full max-w-[1600px] bg-[#3D5D91] rounded-[2.5rem] ring-1 ring-white/10 shadow-2xl min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] relative overflow-clip flex flex-col">
              {/* Noise Overlay */}
              <div 
                className="pointer-events-none absolute inset-0 z-0 opacity-15 mix-blend-overlay"
                style={{ backgroundImage: "url('/_static/noise.svg')" }}
              />
              
              {/* Grid Background */}
              <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:60px_60px]" />
              
              {/* Glow Spheres */}
              <div className="pointer-events-none absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] z-0" />
              <div className="pointer-events-none absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] rounded-full bg-[#5A86CB]/10 blur-[120px] z-0" />

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
