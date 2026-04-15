const { Router } = require("express");
const Ongoing = require("../models/ongoing");
const completed = require("../models/completed");
const ongoingRouter = Router();
const redisClient = require("../services/client");

ongoingRouter.get("/", async (req, res) => {
  let cachedData = await redisClient.get(`ongoing:${req.user._id}`);
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  const allDramas = await Ongoing.find({ userId: req.user._id });
  if (allDramas.length === 0) {
    return res.status(404).json({ error: "No Items Created here" });
  }
  await redisClient.set(
    `ongoing:${req.user._id}`,
    JSON.stringify(allDramas),
    "EX",
    60,
    "NX",
  );
  cachedData = await redisClient.get(`ongoing:${req.user._id}`);
  return res.status(200).json(JSON.parse(cachedData));
});

ongoingRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  let cachedData = await redisClient.get(`ongoing:${id}:${req.user._id}`);
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  const drama = await Ongoing.findOne({ _id: id, userId: req.user._id });
  if (!drama) {
    return res.status(404).json({ error: "Item not found" });
  }
  await redisClient.set(
    `ongoing:${id}:${req.user._id}`,
    JSON.stringify(drama),
    "EX",
    60,
    "NX",
  );
  cachedData = await redisClient.get(`ongoing:${id}:${req.user._id}`);
  return res.status(200).json(JSON.parse(cachedData));
});

ongoingRouter.post("/", async (req, res) => {
  const { name, episode, coverImageUrl } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ error: "Please provide all the required fields" });
  }
  try {
    const newDrama = await Ongoing.create({
      name,
      episode,
      coverImageUrl,
      userId: req.user._id,
    });
    await redisClient.del(`ongoing:${req.user._id}`);
    return res.status(201).json({ message: "Added successfully", newDrama });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

ongoingRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;
  const toUpdate = await Ongoing.findOne({ _id: id, userId: req.user._id });
  try {
    if (!toUpdate) {
      return res.status(404).json({ error: "Item not found" });
    }
    if (updatedItem.name && toUpdate.name !== updatedItem.name) {
      toUpdate.name = updatedItem.name;
    }
    if (updatedItem.episode && toUpdate.episode !== updatedItem.episode) {
      toUpdate.episode = updatedItem.episode;
    }
    if (
      updatedItem.coverImageUrl &&
      toUpdate.coverImageUrl !== updatedItem.coverImageUrl
    ) {
      toUpdate.coverImageUrl = updatedItem.coverImageUrl;
    }
    await toUpdate.save();
    await redisClient.del(`ongoing:${req.user._id}`);
    await redisClient.del(`ongoing:${id}:${req.user._id}`);
    return res.status(200).json({ message: "Changes saved successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

ongoingRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deletedItem = await Ongoing.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });
  if (!deletedItem) {
    return res.status(404).json({ error: "Item not found" });
  }
  await redisClient.del(`ongoing:${req.user._id}`);
  await redisClient.del(`ongoing:${id}:${req.user._id}`);
  return res.status(200).json({ message: "Item deleted successfully" });
});

ongoingRouter.post("/:id/:folderId", async (req, res) => {
  const item = await Ongoing.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!item) return res.status(404).json({ error: "Item not found" });
  await completed.create({
    name: item.name,
    coverImageUrl: item.coverImageUrl,
    userId: req.user._id,
    folderId: req.params.folderId,
  });
  await Ongoing.deleteOne({ _id: req.params.id, userId: req.user._id });
  await redisClient.del(`ongoing:${req.user._id}`);
  await redisClient.del(`ongoing:${req.params.id}:${req.user._id}`);
  await redisClient.del(`Folder:${req.params.folderId}:${req.user._id}`);
  return res.status(200).json({ message: "Moved to completed successfully" });
});

module.exports = ongoingRouter;
