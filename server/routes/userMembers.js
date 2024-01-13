const express = require("express");
const { userViewAllMembers, userSearchMember } = require("../controller/userMembersController.js");
const { verifyToken, requireMemberRole, requireAdminRole } = require("../utils/auth.js");

const router = express.Router();

router.get('/view-all-members', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await userViewAllMembers(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// search member by name
router.get('/search-member/:name', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await userSearchMember(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
