const crypto = require("crypto");
const { env } = require("../config/env");

const algorithm = "aes-256-cbc";
// Generate a key from JWT_SECRET or provide a fallback
const secretKey = crypto.scryptSync(env.jwtSecret || "default-secret-key-32-chars!", "salt", 32);

function encrypt(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

function decrypt(hash) {
  if (!hash) return hash;
  try {
    const parts = hash.split(":");
    if (parts.length !== 2) return hash; // might not be encrypted
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error", error);
    return null;
  }
}

module.exports = {
  encrypt,
  decrypt,
};
