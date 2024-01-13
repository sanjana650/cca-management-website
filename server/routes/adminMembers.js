const express = require("express");
const { adminViewAllMembers, adminSearchMember, adminDeleteMember } = require("../controller/adminMembersController.js");
const { verifyToken, requireMemberRole, requireAdminRole } = require("../utils/auth.js");
const { userModel } = require("../models/userModel.js")

const router = express.Router();

router.get('/view-all-members', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await adminViewAllMembers(req, res)
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Search member by name
router.get('/search-member/:name', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await adminSearchMember(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete member
router.delete('/delete-member/:id', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await adminDeleteMember(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
