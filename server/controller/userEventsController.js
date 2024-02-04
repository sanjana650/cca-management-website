
const eventsModel = require("../models/eventsModel.js")
const userModel = require("../models/userModel.js");


const joinEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { userId, email } = req.body;

    // Update events collection
    const event = await eventsModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if the user is already signed up for the event
    if (event.members_signedup.some(member => member[0] === userId)) {
      return res.status(400).json({ message: "User already signed up for the event." });
    }

    // Update users collection
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is already signed up for the event on the user side
    if (user.events_signedup.some(event => event.eventId === eventId)) {
      return res.status(400).json({ message: "User already signed up for the event." });
    }

    // Add user to members_signedup array in events collection
    event.members_signedup.push([userId, email]);
    event.count += 1;

    await event.save();

    // Add event to events_signedup array in users collection
    user.events_signedup.push({ eventId, title: event.title });

    await user.save();

    res.status(200).json({ message: "User successfully signed up for the event." });
  } catch (error) {
    console.error(error);  // Log the error
    res.status(500).json({ error: error.message });
  }
};

const leaveEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { userId, email } = req.body;

    // Update events collection
    const event = await eventsModel.findById(eventId);
    const user = await userModel.findById(userId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is already signed up for the event
    if (!(event.members_signedup.some(member => member[0] === userId) && user.events_signedup.some(event => event.eventId === eventId))) {
      return res.status(400).json({ message: "User has not signed up for the event." });
    }

    // Remove user from members_signedup array in events collection
    event.members_signedup = event.members_signedup.filter(member => member[0] !== userId);
    event.count -= 1;
    await event.save();

    // Remove event from events_signedup array in users collection
    user.events_signedup = user.events_signedup.filter(event => event.eventId !== eventId);
    await user.save();

    res.status(200).json({ message: "User successfully left the event." });
  } catch (error) {
    console.error(error);  // Log the error
    res.status(500).json({ error: error.message });
  }
};

const userFilterEvent = async (req, res) => {
  try {
    const { event_type } = req.params;

    if (!event_type) {
      return res.status(400).json({ error: "Event Type is required for search." });
    }

    const filteredEvents = await eventsModel.find({ event_type });

    if (!filteredEvents || filteredEvents.length === 0) {
      return res.status(404).json({ message: "No events found with the specified event_type." });
    }

    res.status(200).json(filteredEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const userSearchEvent = async (req, res) => {
  try {
    const { title } = req.params;
    if (!title) {
      return res.status(400).json({ error: "Title is required for search." });
    }
    const searchResults = await eventsModel.find(
      { title: { $regex: new RegExp(title, 'i') } }
    );
    // console.log('Search Results:', searchResults);
    // console.log(searchResults.length);

    if (searchResults.length === 0) {
      return res.json({ message: "No matching events found." });
    }

    res.json(searchResults);
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = { joinEvent, leaveEvent, userSearchEvent, userFilterEvent };
