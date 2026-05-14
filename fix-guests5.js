const fs = require("fs");
let content = fs.readFileSync("app/events/[id]/guests/page.tsx", "utf8");
content = content.replace(
  "bulkText.trim().split(String.fromCharCode(10))).filter(l => l.trim()).length",
  "bulkText.trim().split(String.fromCharCode(10)).filter(l => l.trim()).length"
);
fs.writeFileSync("app/events/[id]/guests/page.tsx", content, "utf8");
console.log("Imefanikiwa!");
