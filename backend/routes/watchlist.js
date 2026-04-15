const { Router } = require("express");
const watchlistRouter = Router();
const watchlist = require("../models/watchlist");
const Ongoing = require("../models/ongoing");
const redisClient = require("../services/client");

watchlistRouter.get("/", async (req, res) => {
  let cachedData = await redisClient.get(`watchlist:${req.user._id}`);
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  const allDramas = await watchlist.find({ userId: req.user._id });
  if (allDramas.length === 0) {
    return res.status(404).json({ error: "No Items created here" });
  }
  await redisClient.set(
    `watchlist:${req.user._id}`,
    JSON.stringify(allDramas),
    "EX",
    60,
    "NX",
  );
  cachedData = await redisClient.get(`watchlist:${req.user._id}`);
  return res.status(200).json(JSON.parse(cachedData));
});

watchlistRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  let cachedData = await redisClient.get(`watchlist:${id}:${req.user._id}`);
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  const drama = await watchlist.findOne({ _id: id, userId: req.user._id });
  if (!drama) {
    return res.status(404).json({ error: "Item does not exist in watchlist" });
  }
  await redisClient.set(
    `watchlist:${id}:${req.user._id}`,
    JSON.stringify(drama),
    "EX",
    60,
    "NX",
  );
  cachedData = await redisClient.get(`watchlist:${id}:${req.user._id}`);
  return res.status(200).json(JSON.parse(cachedData));
});

watchlistRouter.post("/", async (req, res) => {
  const { name, coverImageUrl } = req.body;
  try {
    if (!name) return res.status(400).json({ error: "Please provide name" });
    const newDrama = await watchlist.create({
      name,
      coverImageUrl,
      userId: req.user._id,
    });
    await redisClient.del(`watchlist:${req.user._id}`);
    return res
      .status(201)
      .json({ message: "Added to watchlist successfully", newDrama });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

watchlistRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;
  const toUpdate = await watchlist.findOne({ _id: id, userId: req.user._id });
  try {
    if (!toUpdate) {
      return res.status(404).json({ error: "Item not found in watchlist" });
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
    await toUpdate.save();
    await redisClient.del(`watchlist:${id}:${req.user._id}`);
    await redisClient.del(`watchlist:${req.user._id}`);
    return res.status(200).json({ message: "Changes saved successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

watchlistRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedDrama = await watchlist.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!deletedDrama) {
      return res.status(404).json({ error: "Item not found in watchlist" });
    }
    await redisClient.del(`watchlist:${id}:${req.user._id}`);
    await redisClient.del(`watchlist:${req.user._id}`);
    return res
      .status(200)
      .json({ message: "Deleted from watchlist successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

watchlistRouter.post("/:id/move", async (req, res) => {
  const item = watchlist.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) {
    return res.status(404).json({ error: "Item not found in watchlist" });
  }
  try {
    const newOngoing = await Ongoing.create({
      name: item.name,
      coverImageUrl: item.coverImageUrl,
      userId: req.user._id,
    });
    await watchlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    await redisClient.del(`watchlist:${req.params.id}:${req.user._id}`);
    await redisClient.del(`watchlist:${req.user._id}`);
    await redisClient.del(`ongoing:${req.user._id}`);
    return res
      .status(200)
      .json({ message: "Moved to ongoing successfully", newOngoing });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = watchlistRouter;
