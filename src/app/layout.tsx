import type { Metadata } from "next"
import "./globals.css"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThirdwebProvider } from "thirdweb/react"
import { ProtectionMobile } from "@/modules/mobile-protection"
import { ContextProvider } from "@/modules/wagmi-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Panorama Block",
  description: "Panorama Block was built on a strong academic foundation, with a focus on research and collaboration with top-tier talent. Our partnerships with UCLA's Economics Department and leading Brazilian universities and think tanks drive the development of decentralized data analytics and AI/ML tools, fully aligned with our mission to advance AI technologies, simplify user experiences, democratize data access, and provide action-oriented intelligence that empower participants and investment decisions, supporting the growth of a data-powered, agentic economy.",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`[&_*]:font-suisse`}
      >
        <AppRouterCacheProvider>
          <ContextProvider>
            <ThirdwebProvider>
              <ProtectionMobile>
                {children}
                <Toaster className="bg-backgroundPrimary outline outline-[#4C4C4C]" />
              </ProtectionMobile>
            </ThirdwebProvider>
          </ContextProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
