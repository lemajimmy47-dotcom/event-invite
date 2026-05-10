const fs = require("fs");
const content = `import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import LayoutWrapper from "@/components/LayoutWrapper"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InviteYetu — Digital Invitations",
  description: "Tengeneza na tuma mialiko ya kidijitali kwa urahisi",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw">
      <body className={geistSans.variable + " " + geistMono.variable + " antialiased"}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}`;
fs.writeFileSync("app/layout.tsx", content, "utf8");
console.log("Layout imeandikwa!");
