const express = require("express");
const { verifyToken, requireMemberRole, requireAdminRole } = require("../utils/auth.js");
const { viewUpdates } = require("../controller/userUpdatesController.js");

const router = express.Router();

router.get('/view-all-updates', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await viewUpdates(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
