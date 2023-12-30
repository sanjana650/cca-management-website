import express from "express";
import { verifyToken, requireMemberRole, requireAdminRole } from "../utils/auth.mjs";
import { viewUpdates } from "../controller/userUpdatesController.mjs"


const router = express.Router();

router.get('/view-all-updates', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await viewUpdates(req, res)
  } catch (error) {
    res.status(400).send(error.message);
  }
})

export default router;