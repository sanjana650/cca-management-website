import updatesModel from "../models/updatesModel.mjs";

const createNewUpdate = async (data) => {
  try {
    const { content, date_posted } = data;

    const newUpdate = new updatesModel({
      content, date_posted
    });

    const createdUpdate = await newUpdate.save();
    return createdUpdate;

  } catch (error) {
    throw error;
  }
}

const editUpdate = async (req, res, data) => {
  try {
    const { content, date_posted } = data;
    const updated = await updatesModel.findByIdAndUpdate(req.params.id, { content, date_posted }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Update successfully edited", updated });
    return updated;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteUpdate = async (req, res) => {
  try {
    const deleted = await updatesModel.findByIdAndDelete(req.params.id, { new: true });

    if (!deleted) {
      return { error: "User not found" };
    }

    res.json({ message: "Update deleted successfully" });
    return deleted;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const viewAllUpdates = async (req, res) => {
  try {
    const view = await updatesModel.find();
    res.json(view)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const viewSelectedUpdate = async (req, res, data) => {
  try {
    const view = await updatesModel.findById(req.params.id);
    res.json(view)
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
}

export { createNewUpdate, editUpdate, deleteUpdate, viewAllUpdates,viewSelectedUpdate };
