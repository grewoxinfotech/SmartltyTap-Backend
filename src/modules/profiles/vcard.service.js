function generateVCard(profile) {
  // Simple vCard 3.0 format
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.name || "SmartlyTap Contact"}`,
    `ORG:${profile.businessName || ""}`,
    `TITLE:${profile.title || ""}`,
    `TEL;TYPE=CELL:${profile.phone || ""}`,
    `EMAIL;TYPE=INTERNET:${profile.email || ""}`,
    `URL:${profile.website || ""}`,
    `NOTE:${profile.bio ? profile.bio.replace(/\n/g, " ") : ""}`,
    "END:VCARD",
  ];
  return lines.filter(line => !line.endsWith(":")).join("\r\n");
}

module.exports = { generateVCard };
