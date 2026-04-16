const { Router } = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const { requireAuth } = require("../../middleware/auth");
const { env } = require("../../config/env");
const { ok, fail } = require("../../utils/response");

const router = Router();

cloudinary.config({
  cloud_name: env.cloudinaryName || "demo",
  api_key: env.cloudinaryKey || "demo",
  api_secret: env.cloudinarySecret || "demo",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "smartlytap_profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

router.post("/profile-image", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return fail(res, 400, "No image uploaded");
  return ok(res, { url: req.file.path });
});

module.exports = router;