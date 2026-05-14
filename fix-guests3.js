const fs = require("fs");
let content = fs.readFileSync("app/events/[id]/guests/page.tsx", "utf8");
const lines = content.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("placeholder={") && lines[i].includes("Amina Hassan")) {
    lines[i] = "                className=\"w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400\" placeholder=\"Amina Hassan, 0712345678, , SINGLE\" />";
    if (lines[i+1] && lines[i+1].includes("John Doe")) lines.splice(i+1, 1);
    if (lines[i+1] && lines[i+1].includes("Fatuma Ali")) lines.splice(i+1, 1);
    break;
  }
}
fs.writeFileSync("app/events/[id]/guests/page.tsx", lines.join("\n"), "utf8");
console.log("Imefanikiwa!");
