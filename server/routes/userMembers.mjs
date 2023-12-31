
import express from "express";
import { userViewAllMembers, userSearchMember } from "../controller/userMembersController.mjs";
import { verifyToken, requireMemberRole, requireAdminRole } from "../utils/auth.mjs";

const router = express.Router();

router.get('/view-all-members', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await userViewAllMembers(req, res)
  } catch (error) {
    res.status(400).send(error.message);
  }
})

//search member by name
router.get('/search-member/:name', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await userSearchMember(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
})
export default router;