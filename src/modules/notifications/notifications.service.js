const { sendOtpEmail, sendResetPasswordEmail, sendLeadNotificationEmail } = require("../../utils/email");
const { User, UserSubscription, Plan } = require("../../models");

async function notifyRenewal(userId) {
  const user = await User.findByPk(userId);
  if (!user) return;
  
  // Logic to send renewal email...
  console.log(`[Notification] Renewal reminder sent to ${user.email}`);
}

async function broadcastSystemAnnouncement(message) {
  // Logic to send to all active users...
  console.log(`[Notification] Broadcast: ${message}`);
}

async function sendLeadNotification(userId, leadData) {
  const user = await User.findByPk(userId);
  if (!user) return;
  
  try {
    await sendLeadNotificationEmail(user.email, leadData);
    console.log(`[Notification] Lead email sent to ${user.email}`);
  } catch (err) {
    console.error(`[Notification] Failed to send lead email: ${err.message}`);
  }
}

module.exports = {
  notifyRenewal,
  broadcastSystemAnnouncement,
  sendLeadNotification,
};
