"use client";

import React, { useState, useEffect } from "react";
import { PhoneCall } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FloatingActionBtn() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button after scrolling down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <Link
      href="/contact"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:bg-blue-500 hover:scale-105 active:scale-95",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      )}
    >
      <PhoneCall className="h-4 w-4 animate-pulse" />
      <span className="hidden sm:inline">Programează un apel</span>
    </Link>
  );
}
