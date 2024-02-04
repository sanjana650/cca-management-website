const userModel = require("../models/userModel.js")


// const adminViewAllMembers = async (req, res) => {
//   try {
//     const role = 'member';
//     //specify the fields to display
//     const fieldsToDisplay = 'profile_pic name email age diploma about role';
//     //filter users by role and select specific fields
//     const view = await userModel.find({ role }, fieldsToDisplay);
//     res.json(view)
//   } catch (error) {
//     res.status(500).json({ error: error.message });

//   }
// }
const adminViewAllMembers = async (req, res) => {
  try {
    const role = 'member';
    // specify the fields to display
    const fieldsToDisplay = 'profile_pic name email age diploma about role';
    // filter users by role and select specific fields
    const view = await userModel.find({ role }, fieldsToDisplay);
    return res.status(200).json(view);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


// const adminSearchMember = async (req, res) => {
//   try {
//     const { name } = req.params;
//     console.log('Search query:', name); // Add this line to log the search query


//     if (!name) {
//       return res.status(400).json({ error: "Name parameter is required for search." });
//     }

//     // Assuming the user role is stored in the 'role' field
//     const role = 'member';

//     // Specify the fields to display
//     const fieldsToDisplay = 'profile_pic name email age diploma about role';

//     // Case-insensitive search for users by name, filter by role, and select specific fields
//     const searchResults = await userModel.find(
//       { name: { $regex: new RegExp(name, 'i') }, role },
//       fieldsToDisplay
//     );

//     console.log('Search Results:', searchResults);
//     console.log(searchResults.length)
//     if (searchResults.length === 0) {
//       return res.json({ message: "No matching members found." });
//     }

//     res.json(searchResults);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const adminSearchMember = async (req, res) => {
  try {
    const { name } = req.params;
    // console.log('Search query:', name);

    if (!name) {
      return res.status(400).json({ error: "Name parameter is required for search." });
    }

    const role = 'member';
    const fieldsToDisplay = 'profile_pic name email age diploma about role';

    const searchResults = await userModel.find(
      { name: { $regex: new RegExp(name, 'i') }, role },
      fieldsToDisplay
    );

    // console.log('Search Results:', searchResults);
    // console.log(searchResults.length);

    if (searchResults.length === 0) {
      // Return a response with status 200 and the message
      return res.status(200).json({ message: "No matching members found." });
    }

    // Return the search results with status 200
    return res.status(200).json(searchResults);

  } catch (error) {
    // Ensure that the `res` object is defined before calling `status`
    if (res) {
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Response object is not defined.");
    }
  }
};




const adminDeleteMember = async (req, res) => {
  try {
    const deleted = await userModel.findByIdAndDelete(req.params.id, { new: true });

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
    return deleted;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = { adminViewAllMembers, adminSearchMember, adminDeleteMember };
