const fs = require("fs");
let content = fs.readFileSync("app/events/[id]/guests/page.tsx", "utf8");
const oldCsv = `.map(r => r.join(",")).join(String.fromCharCode(10))`;
const newCsv = `.map(r => r.join(",")).join(String.fromCharCode(10))`;
// Fix the join line directly
const lines = content.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(".map(r => r.join") && lines[i].includes(".join(")) {
    lines[i] = `    const csv = [headers, ...rows].map(r => r.join(",")).join(String.fromCharCode(10))`;
    // Remove next line if it is just closing quote
    if (lines[i+1] && lines[i+1].trim() === `")`) {
      lines.splice(i+1, 1);
    }
    break;
  }
}
content = lines.join("\n");
fs.writeFileSync("app/events/[id]/guests/page.tsx", content, "utf8");
console.log("Imefanikiwa!");
