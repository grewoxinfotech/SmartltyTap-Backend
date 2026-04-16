const nodemailer = require("nodemailer");
const { env } = require("../config/env");

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

async function sendResetPasswordEmail(to, resetLink) {
  const info = await transporter.sendMail({
    from: `"SmartlyTap" <${env.smtp.from}>`,
    to,
    subject: "Reset Your SmartlyTap Password",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#4F46E5;margin-bottom:8px;">Reset Your Password</h2>
        <p style="color:#374151;">We received a request to reset your SmartlyTap password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetLink}"
           style="display:inline-block;margin-top:24px;padding:14px 28px;background:#4F46E5;color:#fff;border-radius:12px;text-decoration:none;font-weight:700;">
          Reset Password
        </a>
        <p style="margin-top:24px;color:#6B7280;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="margin-top:32px;border-color:#E5E7EB;" />
        <p style="color:#9CA3AF;font-size:11px;">SmartlyTap · NFC Digital Business Cards</p>
      </div>
    `,
  });
  return info;
}

module.exports = { sendResetPasswordEmail };
