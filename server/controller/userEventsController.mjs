// controllers/eventController.mjs
import eventsModel from "../models/eventsModel.mjs";
import userModel from "../models/userModel.mjs";

const joinEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id; // Assuming you have user information stored in req.user after authentication
    const userEmail = req.user.email; // Assuming you have user information stored in req.user after authentication

    // Update events collection
    const event = await eventsModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if the user is already signed up for the event
    if (event.members_signedup.some(member => member[0] === userId)) {
      return res.status(400).json({ message: "User already signed up for the event." });
    }

    // Add user to members_signedup array in events collection
    event.members_signedup.push([userId, userEmail]);
    event.count += 1;

    await event.save();

    // Update users collection
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Add event to events_signedup array in users collection
    user.events_signedup.push([eventId, event.title]);

    await user.save();

    res.status(200).json({ message: "User successfully signed up for the event." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { joinEvent };
