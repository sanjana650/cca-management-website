import express from "express";
import { adminViewAllMembers, adminSearchMember, adminDeleteMember } from "../controller/adminMembersController.mjs";
import { verifyToken, requireMemberRole, requireAdminRole } from "../utils/auth.mjs";

const router = express.Router();

router.get('/view-all-members', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await adminViewAllMembers(req, res)
  } catch (error) {
    res.status(400).send(error.message);
  }
})

//search member by name
router.get('/search-member/:name', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await adminSearchMember(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
})

//delete member
router.delete('/delete-member/:id', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await adminDeleteMember(req, res);
  } catch (error) {
    res.status(400).send(error.message);

  }
})

export default router;