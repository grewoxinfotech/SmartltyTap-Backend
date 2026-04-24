const crypto = require("crypto");

// In-memory OTP store (for production, use Redis)
const otpStore = new Map();
const OTP_TTL = 5 * 60 * 1000; // 5 minutes

function generateOtp(identity) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(identity, {
    code,
    expires: Date.now() + OTP_TTL,
  });
  return code;
}

function verifyOtp(identity, code) {
  const stored = otpStore.get(identity);
  if (!stored) return false;
  if (Date.now() > stored.expires) {
    otpStore.delete(identity);
    return false;
  }
  const valid = stored.code === code;
  if (valid) otpStore.delete(identity);
  return valid;
}

module.exports = {
  generateOtp,
  verifyOtp,
};
