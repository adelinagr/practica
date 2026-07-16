import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { NavMobile } from "@/components/layout/mobile-nav";
import { SmoothScrollProvider } from "@/components/shared/smooth-scroll-provider";
import { ChatWidget } from "@/components/shared/chat-widget";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <SmoothScrollProvider>
      <div className="flex min-h-screen flex-col bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <NavMobile />
        <NavBar scroll={true} />
        <main className="flex-1">{children}</main>
        <ChatWidget />
        <SiteFooter />
      </div>
    </SmoothScrollProvider>
  );
}
