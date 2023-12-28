import userModel from "../models/userModel.mjs";

const viewAllMembers = async (req, res) => {
  try {
    const role = 'member';
    //specify the fields to display
    const fieldsToDisplay = 'name email age diploma about role';
    //filter users by role and select specific fields
    const view = await userModel.find({ role }, fieldsToDisplay);
    res.json(view)
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
}

const searchMember = async (req, res) => {
  try {
    const { name } = req.params;
    console.log('Search query:', name); // Add this line to log the search query


    if (!name) {
      return res.status(400).json({ error: "Name parameter is required for search." });
    }

    // Assuming the user role is stored in the 'role' field
    const role = 'member';

    // Specify the fields to display
    const fieldsToDisplay = 'name email age diploma about role';

    // Case-insensitive search for users by name, filter by role, and select specific fields
    const searchResults = await userModel.find(
      { name: { $regex: new RegExp(name, 'i') }, role },
      fieldsToDisplay
    );

    console.log('Search Results:', searchResults);
    console.log(searchResults.length)
    if (searchResults.length === 0) {
      return res.status(404).json({ message: "No matching members found." });
    }

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editMember = async (req, res) => {
  try {
    const { name, age, diploma, about, role } = req.body; // Extract data from the request body
    const updated = await userModel.findByIdAndUpdate(req.params.id, { name, age, diploma, about, role }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Update successfully edited", updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const deleted = await userModel.findByIdAndDelete(req.params.id, { new: true });

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Update deleted successfully" });
    return deleted;
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
}

export { viewAllMembers, searchMember, editMember, deleteMember };
