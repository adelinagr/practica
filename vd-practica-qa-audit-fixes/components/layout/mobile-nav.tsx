"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { DocsSidebarNav } from "@/components/docs/sidebar-nav";
import { Icons } from "@/components/shared/icons";

export function NavMobile() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";

  const configMap = {
    docs: docsConfig.mainNav,
  };

  const links =
    (selectedLayout && configMap[selectedLayout]) || marketingConfig.mainNav;

  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-4 top-6 z-50 rounded-full p-2.5 backdrop-blur-md border border-white/10 bg-[#F2DCDB]/5 transition-colors duration-200 hover:bg-[#F2DCDB]/10 focus:outline-none active:bg-[#F2DCDB]/20 md:hidden",
          open && "bg-[#F2DCDB]/10",
        )}
      >
        {open ? (
          <X className="size-5 text-muted-foreground" />
        ) : (
          <Menu className="size-5 text-muted-foreground" />
        )}
      </button>

      <nav
        className={cn(
          "fixed inset-0 z-40 hidden w-full overflow-auto bg-[#1a1a1a]/95 backdrop-blur-xl px-5 py-24 lg:hidden",
          open && "block",
        )}
      >
        <ul className="grid divide-y divide-white/10">
          {links && links.length > 0 && links.map(({ title, href }) => (
            <li key={href} className="py-4">
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="flex w-full text-lg font-medium capitalize text-[#F2DCDB] hover:text-[#DB7F8E] transition-colors"
              >
                {title}
              </Link>
            </li>
          ))}

          {session ? (
            <>
              {session.user.role === "ADMIN" ? (
                <li className="py-4">
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex w-full text-lg font-medium capitalize text-[#DB7F8E] hover:text-[#F2DCDB] transition-colors"
                  >
                    Panou Administrator
                  </Link>
                </li>
              ) : null}

              <li className="py-4">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex w-full text-lg font-medium capitalize text-[#F2DCDB] hover:text-[#DB7F8E] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li className="py-4">
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex w-full text-left text-lg font-medium capitalize text-[#F2DCDB] hover:text-[#DB7F8E] transition-colors"
                >
                  Deconectare
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="py-4">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex w-full text-lg font-medium capitalize text-[#F2DCDB] hover:text-[#DB7F8E] transition-colors"
                >
                  Autentificare
                </Link>
              </li>

              <li className="py-4">
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex w-full text-lg font-medium capitalize text-[#F2DCDB] hover:text-[#DB7F8E] transition-colors"
                >
                  Creare Cont
                </Link>
              </li>
            </>
          )}
        </ul>

        {documentation ? (
          <div className="mt-8 block md:hidden">
            <DocsSidebarNav setOpen={setOpen} />
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-end space-x-4">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer" className="text-[#F2DCDB]/60 hover:text-[#F2DCDB]">
            <Icons.gitHub className="size-6" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
