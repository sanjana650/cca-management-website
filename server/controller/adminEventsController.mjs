import eventsModel from "../models/eventsModel.mjs";

const createNewEvent = async (data) => {
  try {
    const { event_image, title, event_type, event_date, event_time, location, max_slots, description, count } = data;
    const newEvent = new eventsModel({
      event_image, title, event_type, event_date, event_time, location, max_slots, description, count
    });
    const createdEvent = await newEvent.save();
    return createdEvent;
  } catch (error) {
    throw error;
  }
}
const editEvent = async (req, res, data) => {
  console.log("Event ID from Params:", req.params.id);

  try {
    const { event_image, title, event_type, event_date, event_time, location, max_slots, description } = data;

    const updated = await eventsModel.findByIdAndUpdate(req.params.id, {
      event_image, // Use req.file directly
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

    if (event_image) {
      const imageBuffer = event_image.buffer.toString('base64');
      updated.event_image = imageBuffer;
    }

    await updated.save();

    res.json({ message: "Event successfully edited", updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const viewAllEvents = async (req, res) => {
  try {
    const view = await eventsModel.find();
    res.json(view)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const viewSelectedEvent = async (req, res) => {
  try {
    const view = await eventsModel.findById(req.params.id);
    res.json(view)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteEvent = async (req, res) => {
  try {
    const deleted = await eventsModel.findByIdAndDelete(req.params.id, { new: true });
    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Event deleted successfully" });
    return deleted;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { createNewEvent, editEvent, viewAllEvents, viewSelectedEvent, deleteEvent };
