const { Settings } = require("../../models");
const { successResponse, errorResponse } = require("../../utils/response");
const crypto = require("../../utils/crypto");

let settingsCache = null;

const getSettings = async (req, res) => {
  try {
    if (settingsCache) {
      return successResponse(res, "Settings fetched successfully", settingsCache);
    }
    
    let settings = await Settings.findOne();
    if (!settings) {
      // Return empty if not created yet
      return successResponse(res, "Settings fetched successfully", {});
    }

    const settingsObj = settings.toJSON();
    // Decrypt sensitive info for admin consumption, or strip it based on use-case
    // We will keep it stripped for non-admin but since this might be global, let's just strip secret
    // Actually, only Admin should hit this to see everything.
    if (req.user && req.user.role === "ADMIN") {
      if (settingsObj.razorpay_secret) {
        settingsObj.razorpay_secret_decrypted = crypto.decrypt(settingsObj.razorpay_secret);
      }
      if (settingsObj.smtp_config && settingsObj.smtp_config.password) {
        settingsObj.smtp_config.password_decrypted = crypto.decrypt(settingsObj.smtp_config.password);
      }
    } else {
      delete settingsObj.razorpay_secret;
      if (settingsObj.smtp_config) delete settingsObj.smtp_config.password;
    }

    settingsCache = settingsObj; // Update cache
    
    return successResponse(res, "Settings fetched successfully", settingsObj);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateSettings = async (req, res) => {
  try {
    const data = req.body;
    let settings = await Settings.findOne();

    // Encrypt sensitive info
    if (data.razorpay_secret && data.razorpay_secret !== "xxxxxxxxxxxxxxxxxxxx") {
      data.razorpay_secret = crypto.encrypt(data.razorpay_secret);
    } else if (settings) {
      // Don't overwrite with placeholder
      delete data.razorpay_secret;
    }

    if (data.smtp_config && data.smtp_config.password && data.smtp_config.password !== "********") {
      data.smtp_config.password = crypto.encrypt(data.smtp_config.password);
    } else if (settings && data.smtp_config) {
      delete data.smtp_config.password; // Preserve old pass if config passed but password is just placeholders
      // Keep existing password
      data.smtp_config.password = settings.smtp_config.password; 
    }

    if (!settings) {
      settings = await Settings.create(data);
    } else {
      // We might need to merge smtp_config deeply if only parts are updated
      if (data.smtp_config && settings.smtp_config) {
        data.smtp_config = { ...settings.smtp_config, ...data.smtp_config };
      }
      if (data.branding && settings.branding) {
        data.branding = { ...settings.branding, ...data.branding };
      }
      await settings.update(data);
    }

    // Clear cache
    settingsCache = null;

    return successResponse(res, "Settings updated successfully", settings);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
