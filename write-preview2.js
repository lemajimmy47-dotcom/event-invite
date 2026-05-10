const fs = require("fs");
const lines = fs.readFileSync("app/events/[id]/preview/page.tsx", "utf8").split("\n");
const newLines = lines.map(line => {
  if (line.includes("wa.me/[") || line.includes("wa.me/%22")) {
    return "                    href={\"https://wa.me/\" + selectedGuest.phone.replace(/^0/, \"255\") + \"?text=\" + encodeURIComponent(\"Karibu \" + selectedGuest.name + \"! Pakua invitation: \" + invitationLink)}";
  }
  return line;
});
fs.writeFileSync("app/events/[id]/preview/page.tsx", newLines.join("\n"), "utf8");
console.log("Fixed!");
