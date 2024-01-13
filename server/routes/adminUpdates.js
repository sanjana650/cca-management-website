const dayjs = require("dayjs"); // require dayjs for date formatting
const express = require("express");
const { createNewUpdate, editUpdate, deleteUpdate, viewAllUpdates, viewSelectedUpdate } = require("../controller/adminUpdatesController.js");
const { verifyToken, requireMemberRole, requireAdminRole } = require("../utils/auth.js");

const router = express.Router();

router.post('/add-updates', verifyToken, requireAdminRole, async (req, res) => {
  try {
    let { content } = req.body;
    content = content.trim();

    if (content == "") {
      throw Error("Content cannot be empty");
    }
    else {
      // function to post updates
      // create date
      const date_posted = dayjs().format("DD/MM/YY, hh:mmA");
      const createdUpdate = await createNewUpdate({
        content, date_posted
      });
      res.status(200).json({
        status: "SUCCESS",
        message: "Update successfully posted",
        data: createdUpdate
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.patch('/edit-update/:id', verifyToken, requireAdminRole, async (req, res) => {
  try {
    let { content } = req.body;
    content = content.trim();

    if (content == "") {
      throw Error("Content cannot be empty");
    } else {
      const date_posted = dayjs().format("DD/MM/YY, hh:mmA");

      // Call the editUpdate function with req, res, and data
      await editUpdate(req, res, { content, date_posted });
    }
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
});

router.delete('/delete-update/:id', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await deleteUpdate(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/view-all-updates', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await viewAllUpdates(req, res)
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/view-selected-update/:id', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await viewSelectedUpdate(req, res)
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
