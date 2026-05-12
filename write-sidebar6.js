const fs = require("fs");
let content = fs.readFileSync("components/Sidebar.tsx", "utf8");
content = content.replace(
  "{ label: \"Event Details\", icon: \"📋\", path: activeId ? \"/events/\" + activeId : null },",
  "{ label: \"Event Details\", icon: \"📋\", path: activeId ? \"/events/\" + activeId : null },"
);
console.log("Checking current content...");
console.log(content.includes("Event Details") ? "Found Event Details" : "NOT FOUND");
fs.writeFileSync("components/Sidebar.tsx", content, "utf8");
