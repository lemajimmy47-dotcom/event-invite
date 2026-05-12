const fs = require("fs");
let content = fs.readFileSync("components/Sidebar.tsx", "utf8");
content = content.replace(
  "{ label: \"Templates\", icon: \"🎨\", path: activeId ? \"/events/\" + activeId + \"/templates\" : null },",
  "{ label: \"Templates\", icon: \"🎨\", path: activeId ? \"/events/\" + activeId + \"/templates\" : null },{ label: \"Card Designer\", icon: \"✏️\", path: activeId ? \"/events/\" + activeId + \"/editor\" : null },"
);
fs.writeFileSync("components/Sidebar.tsx", content, "utf8");
console.log("Imefanikiwa!");
