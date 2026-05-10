const fs = require("fs");
const content = `"use client"

import { usePathname } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"

const publicPages = ["/landing", "/login", "/"]
const rsvpPage = "/rsvp"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isPublic = publicPages.includes(pathname) || pathname.startsWith(rsvpPage)
  const isLanding = pathname === "/landing" || pathname === "/"

  if (isLanding) {
    return <>{children}</>
  }

  if (isPublic) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  const eventId = pathname.startsWith("/events/") ? pathname.split("/")[2] : undefined

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar eventId={eventId} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}`;
fs.writeFileSync("components/LayoutWrapper.tsx", content, "utf8");
console.log("LayoutWrapper imeandikwa!");
