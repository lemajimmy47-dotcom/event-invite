const fs = require("fs");
let content = fs.readFileSync("app/events/[id]/guests/page.tsx", "utf8");
content = content.replace(
  "const { data } = {}; window.location.reload()",
  "window.location.reload()"
);
fs.writeFileSync("app/events/[id]/guests/page.tsx", content, "utf8");
console.log("Imefanikiwa!");
