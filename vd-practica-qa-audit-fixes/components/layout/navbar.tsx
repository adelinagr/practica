"use client";

import { useContext } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSession } from "next-auth/react";

import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DocsSearch } from "@/components/docs/search";
import { ModalContext } from "@/components/modals/providers";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { Logo } from "@/components/shared/logo";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);

  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";

  const configMap = {
    docs: docsConfig.mainNav,
  };

  const links =
    (selectedLayout && configMap[selectedLayout]) || marketingConfig.mainNav;

  return (
    <header className="absolute top-6 left-0 right-0 z-50 flex w-full justify-center px-4">
      <MaxWidthWrapper className="flex items-center justify-between w-full max-w-6xl">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-[#3D5D91]">
            V
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-[#F2DCDB] hidden sm:block">
            VreauDigitalizare
          </span>
        </Link>

        {/* Center: Pill-shaped Nav */}
        {links && links.length > 0 ? (
          <nav className="hidden md:flex items-center gap-6 rounded-full border border-white/10 bg-[#F2DCDB]/5 px-6 py-2 backdrop-blur-md">
            {links.map((item, index) => (
              <Link
                key={index}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "text-sm font-medium text-[#F2DCDB]/70 transition-colors hover:text-[#F2DCDB]",
                  item.href.startsWith(`/${selectedLayout}`) && "text-[#F2DCDB]",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}

        {/* Right: Status & Action */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex system-status-tag">
            <div className="status-dot"></div>
            SYS.ONLINE
          </div>
          
          {session ? (
            <UserAccountNav />
          ) : status === "unauthenticated" ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="hidden sm:block text-sm font-bold text-[#F2DCDB]/70 hover:text-[#F2DCDB] transition-colors"
              >
                Autentificare
              </Link>
              <Link href="/chestionare">
                <Button className="neon-pulse-btn border-0 shadow-none px-6">
                  Start Assessment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-9 w-[108px] rounded-full bg-[#F2DCDB]/10" />
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
