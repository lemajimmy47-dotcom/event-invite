const fs = require("fs");
const content = fs.readFileSync("app/events/[id]/guests/page.tsx", "utf8");
const lines = content.split("\n");
for (let i = 310; i < 320; i++) {
  console.log((i+1) + ": " + lines[i]);
}
