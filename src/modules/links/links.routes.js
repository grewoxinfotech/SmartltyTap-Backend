const { Router } = require("express");
const { createLink, getLinksByUser, updateLink, deleteLink } = require("./links.controller");

const router = Router();

router.post("/create", createLink);
router.get("/:userId", getLinksByUser);
router.patch("/:linkId", updateLink);
router.delete("/:linkId", deleteLink);

module.exports = router;
