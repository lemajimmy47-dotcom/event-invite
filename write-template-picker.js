const fs = require("fs");
const content = `"use client"

import { templates } from "@/lib/templates"

type Props = {
  selected: string
  onChange: (id: string) => void
}

export default function TemplatePicker({ selected, onChange }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Chagua Template</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onChange(template.id)}
            className={"rounded-xl border-2 p-4 text-center transition cursor-pointer " + (selected === template.id ? "border-blue-500 shadow-md scale-105" : "border-gray-200 hover:border-gray-300")}
            style={{ background: selected === template.id ? template.secondaryColor : "white" }}
          >
            <div className="text-3xl mb-2">{template.emoji}</div>
            <div className="text-sm font-semibold" style={{ color: template.primaryColor }}>
              {template.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}`;
fs.writeFileSync("components/TemplatePicker.tsx", content, "utf8");
console.log("TemplatePicker imeandikwa!");
