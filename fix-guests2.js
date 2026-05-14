const fs = require("fs");
let content = fs.readFileSync("app/events/[id]/guests/page.tsx", "utf8");
const lines = content.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("bulkText.trim().split(") && lines[i+1] && lines[i+1].includes(").filter")) {
    lines[i] = "    const lines = bulkText.trim().split(String.fromCharCode(10)).filter(l => l.trim())";
    lines.splice(i+1, 1);
    break;
  }
}
fs.writeFileSync("app/events/[id]/guests/page.tsx", lines.join("\n"), "utf8");
console.log("Imefanikiwa!");
