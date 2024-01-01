import eventsModel from "../models/eventsModel.mjs";

const createNewEvent = async (data) => {
  try {
    const { title, event_type, event_date, event_time, location, max_slots, description, count } = data;
    const newEvent = new eventsModel({
      title, event_type, event_date, event_time, location, max_slots, description, count
    });
    const createdEvent = await newEvent.save();
    return createdEvent;
  } catch (error) {
    throw error;
  }
}
const editEvent = async (req, res, data) => {
  try {
    const { title, event_type, event_date, event_time, location, max_slots, description, count } = data;
    const updated = await eventsModel.findByIdAndUpdate(req.params.id, {
      title, event_type, event_date, event_time, location, max_slots, description, count
    });
    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Event successfully edited", updated });
    return updated;
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
}
const viewAllEvents = async (req, res) => {
  try {
    const view = await eventsModel.find();
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

    res.json({ message: "Update deleted successfully" });
    return deleted;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { createNewEvent, editEvent, viewAllEvents, deleteEvent };
