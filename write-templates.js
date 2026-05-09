const fs = require("fs");
fs.mkdirSync("lib/templates", { recursive: true });
const content = `export type Template = {
  id: string
  name: string
  emoji: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
  bgGradient: string
  category: string
}

export const templates: Template[] = [
  {
    id: "wedding",
    name: "Harusi",
    emoji: "💍",
    primaryColor: "#be185d",
    secondaryColor: "#fce7f3",
    textColor: "#831843",
    accentColor: "#f9a8d4",
    bgGradient: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 50%, #f8bbd0 100%)",
    category: "wedding"
  },
  {
    id: "birthday",
    name: "Birthday",
    emoji: "🎂",
    primaryColor: "#7c3aed",
    secondaryColor: "#ede9fe",
    textColor: "#4c1d95",
    accentColor: "#c4b5fd",
    bgGradient: "linear-gradient(135deg, #fdf4ff 0%, #ede9fe 50%, #ddd6fe 100%)",
    category: "birthday"
  },
  {
    id: "graduation",
    name: "Mahafali",
    emoji: "🎓",
    primaryColor: "#1d4ed8",
    secondaryColor: "#dbeafe",
    textColor: "#1e3a8a",
    accentColor: "#93c5fd",
    bgGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)",
    category: "graduation"
  },
  {
    id: "general",
    name: "Sherehe",
    emoji: "🎉",
    primaryColor: "#059669",
    secondaryColor: "#d1fae5",
    textColor: "#064e3b",
    accentColor: "#6ee7b7",
    bgGradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
    category: "general"
  },
  {
    id: "sendoff",
    name: "Send Off",
    emoji: "✈️",
    primaryColor: "#0369a1",
    secondaryColor: "#e0f2fe",
    textColor: "#0c4a6e",
    accentColor: "#7dd3fc",
    bgGradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
    category: "sendoff"
  },
  {
    id: "kitchen",
    name: "Kitchen Party",
    emoji: "🍽️",
    primaryColor: "#b45309",
    secondaryColor: "#fef3c7",
    textColor: "#78350f",
    accentColor: "#fcd34d",
    bgGradient: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)",
    category: "kitchen"
  }
]

export function getTemplate(id: string): Template {
  return templates.find(t => t.id === id) || templates[0]
}`;
fs.writeFileSync("lib/templates/index.ts", content, "utf8");
console.log("Templates imeandikwa!");
