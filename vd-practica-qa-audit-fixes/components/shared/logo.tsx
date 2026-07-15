import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps extends Omit<React.ComponentProps<typeof Image>, "src" | "alt"> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <Image 
      src="/logo-trimmed.png" 
      alt="vreaudigitalizare.eu Logo" 
      width={800} 
      height={200}
      className={cn("w-auto h-8 object-contain", className)}
      priority
      {...props}
    />
  );
}
