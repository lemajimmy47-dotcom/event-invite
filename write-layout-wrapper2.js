const fs = require("fs");
const content = `"use client"

import { usePathname } from "next/navigation"
import Sidebar from "@/components/Sidebar"

const publicPages = ["/landing", "/login", "/"]

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isPublic = publicPages.includes(pathname) || pathname.startsWith("/rsvp")
  const isLanding = pathname === "/landing" || pathname === "/"

  if (isLanding) return <>{children}</>

  if (isPublic) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  const pathParts = pathname.split("/")
  const eventId = pathParts[1] === "events" && pathParts[2] && pathParts[2] !== "new" && pathParts[2] !== "create"
    ? pathParts[2]
    : undefined

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar eventId={eventId} />
      <div className="flex-1 overflow-auto min-w-0">
        {children}
      </div>
    </div>
  )
}`;
fs.writeFileSync("components/LayoutWrapper.tsx", content, "utf8");
console.log("LayoutWrapper imeandikwa!");
