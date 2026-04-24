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
  return transporter.sendMail({
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
}

async function sendOtpEmail(to, otp) {
  return transporter.sendMail({
    from: `"SmartlyTap" <${env.smtp.from}>`,
    to,
    subject: "Your SmartlyTap Login Code",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#4F46E5;margin-bottom:8px;">Login Code</h2>
        <p style="color:#374151;">Use the following code to complete your login. It expires in <strong>5 minutes</strong>.</p>
        <div style="margin:24px 0;padding:16px;background:#F3F4F6;border-radius:12px;text-align:center;">
          <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111827;">${otp}</span>
        </div>
        <p style="color:#6B7280;font-size:12px;">Security tip: Never share this code with anyone.</p>
        <hr style="margin-top:32px;border-color:#E5E7EB;" />
        <p style="color:#9CA3AF;font-size:11px;">SmartlyTap · NFC Digital Business Cards</p>
      </div>
    `,
  });
}

async function sendLeadNotificationEmail(to, lead) {
  return transporter.sendMail({
    from: `"SmartlyTap Alerts" <${env.smtp.from}>`,
    to,
    subject: `New Lead: ${lead.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#4F46E5;margin-bottom:8px;">New Lead Captured!</h2>
        <p style="color:#374151;">You have received a new contact submission from your SmartlyTap profile.</p>
        <div style="margin:24px 0;padding:20px;background:#F9FAFB;border-radius:12px;border:1px solid #E5E7EB;">
          <p style="margin:0 0 8px;"><strong>Name:</strong> ${lead.name}</p>
          <p style="margin:0 0 8px;"><strong>Email:</strong> ${lead.email || "N/A"}</p>
          <p style="margin:0 0 8px;"><strong>Phone:</strong> ${lead.phone || "N/A"}</p>
          <p style="margin:0 0 8px;"><strong>Message:</strong><br/>${lead.message || "No message provided."}</p>
          <p style="margin:16px 0 0;font-size:12px;color:#6B7280;">Source: ${lead.source || "NFC Tap"}</p>
        </div>
        <a href="${env.appUrl}/dashboard/leads"
           style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          View All Leads
        </a>
        <hr style="margin-top:32px;border-color:#E5E7EB;" />
        <p style="color:#9CA3AF;font-size:11px;">SmartlyTap · Real-time NFC Analytics</p>
      </div>
    `,
  });
}

module.exports = { sendResetPasswordEmail, sendOtpEmail, sendLeadNotificationEmail };
