const fs = require("fs");
const content = fs.readFileSync("app/events/[id]/preview/page.tsx", "utf8");
const lines = content.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("wa.me/") && lines[i].includes("](https://wa.me/")) {
    lines[i] = `                    href={"https://wa.me/" + selectedGuest.phone.replace(/^0/, "255") + "?text=" + encodeURIComponent("Karibu " + selectedGuest.name + "! Umealikwa kwenye " + event?.name + ". Pakua invitation yako hapa: " + invitationLink)}`;
    break;
  }
}
fs.writeFileSync("app/events/[id]/preview/page.tsx", lines.join("\n"), "utf8");
console.log("Imefanikiwa!");
