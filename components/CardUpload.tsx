"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function CardUpload({ eventId, currentUrl }: { eventId: string, currentUrl?: string }) {
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState(currentUrl ?? "")

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const supabase = createClient()
    const fileName = eventId + "-card." + file.name.split(".").pop()
    const { data, error } = await supabase.storage.from("cards").upload(fileName, file, { upsert: true })
    if (error) {
      alert("Hitilafu: " + error.message)
      setUploading(false)
      return
    }
    const { data: urlData } = supabase.storage.from("cards").getPublicUrl(fileName)
    const publicUrl = urlData.publicUrl
    await supabase.from("events").update({ card_image_url: publicUrl }).eq("id", eventId)
    setUrl(publicUrl)
    setUploading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Picha ya Invitation Card</h3>
      {url && (
        <div className="mb-4">
          <img src={url} className="w-full max-h-48 object-cover rounded-lg border border-gray-200" alt="Card" />
        </div>
      )}
      <label className={"cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition " + (uploading ? "bg-gray-100 text-gray-400" : "bg-blue-600 text-white hover:bg-blue-700")}>
        {uploading ? "Inapakia..." : url ? "Badilisha Picha" : "Pakia Picha ya Card"}
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
      </label>
      <p className="text-xs text-gray-400 mt-2">PNG, JPG — picha itaonekana nyuma ya invitation card ya kila mgeni</p>
    </div>
  )
}