const userModel = require("../models/userModel.js")

const userViewAllMembers = async (req, res) => {
  try {
    const role = 'member';
    // Specify the fields to display
    const fieldsToDisplay = 'profile_pic name email age diploma about';
    // Select specific fields to display
    const view = await userModel.find({ role }, fieldsToDisplay);
    res.status(200).json(view);  // Set status and send JSON response
  } catch (error) {
    console.error(error);  // Log the error for debugging purposes
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const userSearchMember = async (req, res) => {
  try {
    const { name } = req.params;
    // console.log('Search query:', name);

    if (!name) {
      return res.status(400).json({ error: "Name parameter is required for search." });
    }

    const role = 'member';
    const fieldsToDisplay = 'profile_pic name email age diploma about';

    const searchResults = await userModel.find(
      { name: { $regex: new RegExp(name, 'i') }, role },
      fieldsToDisplay
    );

    // console.log('Search Results:', searchResults);
    // console.log(searchResults.length);

    if (searchResults.length === 0) {
      return res.status(404).json({ message: "No matching members found." });
    }

    res.status(200).json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// const userSearchMember = async (req, res) => {
//   try {
//     const { name } = req.params;
//     console.log('Search query:', name);

//     if (!name) {
//       return res.status(400).json({ error: "Name parameter is required for search." });
//     }

//     const role = 'member';
//     const fieldsToDisplay = 'profile_pic name email age diploma about';

//     const searchResults = await userModel.find(
//       { name: { $regex: new RegExp(name, 'i') }, role },
//       fieldsToDisplay
//     );

//     console.log('Search Results:', searchResults);
//     console.log(searchResults.length);

//     if (searchResults.length === 0) {
//       return res.json({ message: "No matching members found." });
//     }

//     res.json(searchResults);
//   } catch (error) {
//     return { error: error.message };
//   }
// };

module.exports = { userViewAllMembers, userSearchMember };
