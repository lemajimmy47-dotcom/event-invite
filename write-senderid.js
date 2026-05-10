const fs = require("fs");
let content = fs.readFileSync("app/events/create/page.tsx", "utf8");
content = content.replace(
`    sender_id: eventType.toUpperCase(),`,
`    sender_id: eventType === "wedding" ? "HARUSI" : eventType === "sendoff" ? "SEND OFF" : eventType === "invitation" ? "MWALIKO" : eventType === "meeting" ? "KIKAO" : eventType === "contribution" ? "MCHANGO" : eventType === "ticket" ? "TIKETI" : eventType === "bulksend" ? "BULK SEND" : "",`
);
content = content.replace(
`              <div>
                <label className={labelClass}>Sender ID</label>
                <input type="text" value={form.sender_id} onChange={e => setForm({ ...form, sender_id: e.target.value })} className={inputClass} placeholder={typeInfo.label} />
              </div>`,
`              <div>
                <label className={labelClass}>Sender ID</label>
                {eventType === "custom" ? (
                  <select value={form.sender_id} onChange={e => setForm({ ...form, sender_id: e.target.value })} className={inputClass}>
                    <option value="">Chagua Aina ya Tukio</option>
                    <option value="HARUSI">HARUSI</option>
                    <option value="SEND OFF">SEND OFF</option>
                    <option value="MWALIKO">MWALIKO</option>
                    <option value="KIKAO">KIKAO</option>
                    <option value="MCHANGO">MCHANGO</option>
                    <option value="TIKETI">TIKETI</option>
                    <option value="BULK SEND">BULK SEND</option>
                  </select>
                ) : (
                  <input type="text" value={form.sender_id} readOnly className={inputClass + " bg-gray-50 cursor-not-allowed"} />
                )}
              </div>`
);
fs.writeFileSync("app/events/create/page.tsx", content, "utf8");
console.log("Sender ID imesasishwa!");
