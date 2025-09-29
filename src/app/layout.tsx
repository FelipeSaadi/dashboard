import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Panorama Block',
  description: 'Landing page',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

