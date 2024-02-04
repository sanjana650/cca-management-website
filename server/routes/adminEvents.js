const express = require("express");
const { createNewEvent, editEvent, viewAllEvents, viewSelectedEvent, deleteEvent } = require("../controller/adminEventsController.js");
const { verifyToken, requireMemberRole, requireAdminRole } = require("../utils/auth.js");
const multer = require("multer");
const eventsModel = require("../models/eventsModel.js");

const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
const router = express.Router();

// Add new event
router.post('/add-event', verifyToken, requireAdminRole, upload.single('event_image'), async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);
    let { event_image, title, event_type, event_date, event_time, location, max_slots, description } = req.body;

    const imageBuffer = req.body.event_image;
    if (!imageBuffer) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    title = title.trim();
    event_type = event_type.trim();
    location = location.trim();
    description = description.trim();

    if (event_image === "" || title === "" || event_type === "" || event_date === "" || event_time == "" || location === "" || max_slots === "" || description === "") {
      throw new Error("Fields cannot be empty");
    } else {
      // Function to add an event
      console.log('event Date:', event_date);
      console.log('event Time:', event_time);
      const count = 0;

      const createdEvent = await createNewEvent({
        event_image: imageBuffer, title, event_type, event_date, event_time, location, max_slots, description, count
      });
      res.status(200).json({
        status: "SUCCESS",
        message: "Event successfully posted",
        data: createdEvent
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Edit event
router.patch('/edit-event/:id', verifyToken, requireAdminRole, upload.single('event_image'), async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);
    const { title, event_type, event_date, event_time, location, max_slots, description } = req.body;

    // Validate other fields as needed
    if (!title || !event_type || !event_date || !event_time || !location || !max_slots || !description) {
      throw new Error("Fields cannot be empty");
    }

    // Assuming eventsModel is a Mongoose model
    const updated = await eventsModel.findByIdAndUpdate(req.params.id, {
      title,
      event_type,
      event_date,
      event_time,
      location,
      max_slots,
      description
    });

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    // If there is an image file, update the event_image field
    if (req.file) {
      const imageBuffer = req.file.buffer.toString('base64');
      updated.event_image = imageBuffer;
    }

    await updated.save();  // Save the updated document

    res.json({ message: "Event successfully edited", updated });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View all events
router.get('/view-all-events', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await viewAllEvents(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// View selected event
router.get('/view-event/:id', verifyToken, requireAdminRole, async (req, res) => {
  try {
    await viewSelectedEvent(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete event
router.delete('/delete-event/:id', async (req, res) => {
  try {
    await deleteEvent(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
