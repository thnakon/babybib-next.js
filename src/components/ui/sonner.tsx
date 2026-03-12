"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { Check } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <>
      <style>{`
        [data-type="default"] {
          background-color: #407bc4 !important;
          border-color: #407bc4 !important;
        }
        [data-type="default"] .sonner-toast-content {
          color: white !important;
        }
        dark [data-type="default"] {
          background-color: #407bc4 !important;
          border-color: #407bc4 !important;
        }
      `}</style>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-zinc-950 dark:group-[.toaster]:text-zinc-50 dark:group-[.toaster]:border-zinc-800",
            description: "group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400",
            actionButton:
              "group-[.toast]:!bg-[#f58e58] group-[.toast]:!text-white hover:group-[.toast]:!bg-[#e47d47] dark:group-[.toast]:!bg-[#f58e58] dark:group-[.toast]:!text-white dark:hover:group-[.toast]:!bg-[#e47d47]",
            cancelButton:
              "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-zinc-400",
          },
        }}
        icons={{
          success: (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
              <Check className="h-3 w-3" />
            </div>
          ),
        }}
      {...props}
    />
    </>
  )
}

export { Toaster }
