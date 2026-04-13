const { Router } = require("express");
const insideFolderRouter = Router({ mergeParams: true }); // This allows us to access the foldername parameter from the parent route which is called completed roughter. We will be using this inside the insideFolderRouter to get the foldername and then we can use that to get the folderId and then we can use that to get the dramas inside that folder.
const Completed = require("../models/completed");
const Folder = require("../models/folder");
const redisClient = require("../services/client");

insideFolderRouter.get("/", async (req, res) => {
  const folderId = req.params.folderId;
  let cachedData = await redisClient.get(`Folder${folderId}:${req.user._id}`);
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  const folder = await Folder.findOne({ _id: folderId, userId: req.user._id });
  if (!folder) return res.status(404).json({ error: "No such Folder exists" });
  const allDramas = await Completed.find({
    userId: req.user._id,
    folderId: folder._id,
  });
  if (allDramas.length === 0)
    return res.status(404).json({ error: "Zero items in this Folder" });
  await redisClient.set(
    `Folder:${folderId}:${req.user._id}`,
    JSON.stringify(allDramas),
    "EX",
    120,
    "NX",
  );
  cachedData = await redisClient.get(`Folder:${folderId}:${req.user._id}`);
  return res.status(200).json(JSON.parse(cachedData));
});

insideFolderRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const folderId = req.params.folderId;
  let cachedData = await redisClient.get(
    `Folder:${folderId}:${req.user._id}:${id}`,
  );
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  const drama = await Completed.findOne({
    _id: id,
    userId: req.user._id,
    folderId: folderId,
  });
  if (!drama)
    return res
      .status(404)
      .json({ error: "No such item exists in this folder" });
  await redisClient.set(
    `Folder:${folderId}:${req.user._id}:${id}`,
    JSON.stringify(drama),
    "EX",
    120,
    "NX",
  );
  cachedData = await redisClient.get(
    `Folder:${id}:${folderId}:${req.user._id}`,
  );
  return res.status(200).json(JSON.parse(cachedData));
});

insideFolderRouter.post("/", async (req, res) => {
  const folderId = req.params.folderId;
  const { name, coverImageUrl } = req.body;
  try {
    if (!name) return res.status(400).json({ error: "Name is required" });
    const newdrama = await Completed.create({
      name,
      coverImageUrl,
      userId: req.user._id,
      folderId: folderId,
    });
    await redisClient.del(`Folder:${folderId}:${req.user._id}`);
    return res.status(201).json({ message: "Added successfully", newdrama });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

insideFolderRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const folderId = req.params.folderId;
  const updatedItem = req.body;
  const toUpdate = await Completed.findOne({
    _id: id,
    userId: req.user._id,
    folderId: folderId,
  });
  try {
    if (!toUpdate) {
      return res.status(404).json({ error: "Item not found" });
    }
    if (updatedItem.name && toUpdate.name !== updatedItem.name) {
      toUpdate.name = updatedItem.name;
    }
    if (
      updatedItem.coverImageUrl &&
      toUpdate.coverImageUrl !== updatedItem.coverImageUrl
    ) {
      toUpdate.coverImageUrl = updatedItem.coverImageUrl;
    }
    await redisClient.del(`Folder:${folderId}:${req.user._id}`);
    await redisClient.del(`Folder:${id}:${folderId}:${req.user._id}`);
    await toUpdate.save();
    return res.status(200).json({ message: "Changes saved successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

insideFolderRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const folderId = req.params.folderId;
  try {
    const deletedDrama = await Completed.findOneAndDelete({
      _id: id,
      userId: req.user._id,
      folderId: folderId,
    });
    if (!deletedDrama) {
      return res.status(404).json({ error: "Item not found" });
    }
    await redisClient.del(`Folder:${folderId}:${req.user._id}`);
    await redisClient.del(`Folder:${id}:${folderId}:${req.user._id}`);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = insideFolderRouter;
