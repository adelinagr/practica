"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#1a1a1a]/90 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-card-foreground group-[.toaster]:border-foreground/10 group-[.toaster]:shadow-[0_0_20px_rgba(242,220,219,0.1)] group-[.toaster]:rounded-xl font-heading",
          description: "group-[.toast]:text-card-foreground/60",
          actionButton:
            "group-[.toast]:bg-card group-[.toast]:text-foreground group-[.toast]:font-bold group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-foreground/10 group-[.toast]:text-card-foreground group-[.toast]:rounded-lg",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
