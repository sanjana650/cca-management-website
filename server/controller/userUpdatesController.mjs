import updatesModel from "../models/updatesModel.mjs";

export const viewUpdates = async (req, res) => {
  try {
    const view = await updatesModel.find();
    res.json(view)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
