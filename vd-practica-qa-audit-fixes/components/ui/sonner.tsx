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
            "group toast group-[.toaster]:bg-[#1a1a1a]/90 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-[#F2DCDB] group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_0_20px_rgba(242,220,219,0.1)] group-[.toaster]:rounded-xl font-heading",
          description: "group-[.toast]:text-[#F2DCDB]/60",
          actionButton:
            "group-[.toast]:bg-[#F2DCDB] group-[.toast]:text-[#3D5D91] group-[.toast]:font-bold group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-[#F2DCDB] group-[.toast]:rounded-lg",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
