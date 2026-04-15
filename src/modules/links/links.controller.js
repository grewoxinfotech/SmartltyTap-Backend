const { Link } = require("../../models");
const { successResponse, errorResponse } = require("../../utils/response");

const createLink = async (req, res) => {
  try {
    const { userId, type, url, label, order } = req.body;

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return errorResponse(res, "Invalid URL format", 400);
    }

    if (!userId || !type || !url) {
      return errorResponse(res, "Missing required fields", 400);
    }

    // Determine order
    let linkOrder = order;
    if (linkOrder === undefined) {
      const maxOrder = await Link.max("order", { where: { user_id: userId } });
      linkOrder = (maxOrder || 0) + 1;
    }

    const newLink = await Link.create({
      user_id: userId,
      type,
      url,
      label,
      order: linkOrder,
    });

    return successResponse(res, "Link created successfully", newLink, 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getLinksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const links = await Link.findAll({
      where: { user_id: userId },
      order: [["order", "ASC"]],
    });
    return successResponse(res, "Links fetched successfully", links);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateLink = async (req, res) => {
  try {
    const { linkId } = req.params;
    const updateData = req.body;
    
    if (updateData.url) {
      try {
        new URL(updateData.url);
      } catch {
        return errorResponse(res, "Invalid URL format", 400);
      }
    }

    const link = await Link.findByPk(linkId);
    if (!link) {
      return errorResponse(res, "Link not found", 404);
    }

    await link.update(updateData);
    return successResponse(res, "Link updated successfully", link);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const deleteLink = async (req, res) => {
  try {
    const { linkId } = req.params;
    const link = await Link.findByPk(linkId);
    if (!link) {
      return errorResponse(res, "Link not found", 404);
    }

    await link.destroy();
    return successResponse(res, "Link deleted successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  createLink,
  getLinksByUser,
  updateLink,
  deleteLink,
};
