const fs = require("fs");
let content = fs.readFileSync("app/events/[id]/send/page.tsx", "utf8");

const oldMsg = `return "Karibu " + guest.name + "! Hii ni kadi yako ya mwaliko ya *" + event?.name + "*. Pakua hapa: " + cardLink`;

const newMsg = `const shortCode = guest.qr_token.substring(0, 6).toUpperCase()
      const nl = String.fromCharCode(10)
      const contacts = [event?.rsvp_contact1, event?.rsvp_contact2, event?.rsvp_contact3].filter(Boolean).join(", ")
      return "Habari " + guest.name + "," + nl + nl +
        (event?.host_name ? event.host_name + " wanakufuraha kukualika" : event?.name + " wanakualika") + nl + nl +
        "Tarehe: " + new Date(event?.date).toLocaleDateString("sw-TZ", {day:"2-digit", month:"long", year:"numeric"}) + nl +
        (event?.venue ? "Ukumbi: " + event?.venue + nl : "") +
        (event?.event_time ? "Saa: " + event?.event_time + " " + (event?.time_period||"") + nl : "") +
        (event?.dress_code ? "Dress Code: " + event?.dress_code + nl : "") +
        (contacts ? "Mawasiliano: " + contacts + nl : "") + nl +
        "Tafadhali Kumbuka kuja na kadi hii mlangoni" + nl + nl +
        "Kumbukumbu ya Mwaliko: " + shortCode + nl + nl +
        "Kadi yako: " + cardLink`;

content = content.replace(oldMsg, newMsg);
fs.writeFileSync("app/events/[id]/send/page.tsx", content, "utf8");
console.log("Imefanikiwa!");
