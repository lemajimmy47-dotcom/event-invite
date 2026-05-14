const fs = require("fs");
let content = fs.readFileSync("app/events/[id]/guests/page.tsx", "utf8");

// Fix all newline splits
const lines = content.split("\n");
const fixed = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  if (skip) { skip = false; continue; }
  
  // Fix split newline pattern
  if (lines[i].includes(".split(\"") && !lines[i].includes(".split(\"\")") && lines[i+1] && lines[i+1].includes(").filter")) {
    const fixedLine = lines[i].replace(".split(\"", ".split(String.fromCharCode(10))//") + lines[i+1].replace(").filter", ".filter");
    // simpler approach - just replace the split call
    const newLine = lines[i].replace(/\.split\("$/, ".split(String.fromCharCode(10))") + lines[i+1].replace(/^"\)/, ")");
    fixed.push(newLine);
    skip = true;
    continue;
  }
  
  fixed.push(lines[i]);
}

let result = fixed.join("\n");

// Fix remaining patterns directly
result = result.replace(
  /bulkText\.trim\(\)\.split\(String\.fromCharCode\(10\)\)\/\/\.filter/g,
  "bulkText.trim().split(String.fromCharCode(10)).filter"
);

result = result.replace(
  /bulkText\.trim\(\)\.split\("[^"]*\n[^"]*"\)\.filter/g,
  "bulkText.trim().split(String.fromCharCode(10)).filter"
);

fs.writeFileSync("app/events/[id]/guests/page.tsx", result, "utf8");
console.log("Imefanikiwa!");
