import eventsModel from "../models/eventsModel.mjs";
import express from "express";
import { verifyToken, requireMemberRole, requireAdminRole } from "../utils/auth.mjs";
import { joinEvent, leaveEvent, userSearchEvent, userFilterEvent } from "../controller/userEventsController.mjs";
import { viewAllEvents, viewSelectedEvent } from "../controller/adminEventsController.mjs";

const router = express.Router();

//join event
router.post('/join-event/:eventId', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await joinEvent(req, res);
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error)
  }
});

//leave event
router.post('/leave-event/:eventId', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await leaveEvent(req, res);
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error)
  }
});

//view all events
router.get('/view-all-events', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await viewAllEvents(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
})

//view single event
router.get('/view-event/:id', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await viewSelectedEvent(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
})

//search for event
router.get('/search-event/:title', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await userSearchEvent(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
})

//filter event by type
router.get('/filter-events/:event_type', verifyToken, requireMemberRole, async (req, res) => {
  try {
    await userFilterEvent(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
})

export default router;