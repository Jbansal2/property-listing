const Favorite = require("../models/Favorite");
const { redisClient } = require("../config/redis");

const addFavorite = async (req, res) => {
  const { propertyId } = req.body;
  try {
    const favorite = new Favorite({ userId: req.user.userId, propertyId });
    await favorite.save();
    await redisClient.del(`favorites:${req.user.userId}`);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getFavorites = async (req, res) => {
  const cacheKey = `favorites:${req.user.userId}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const favorites = await Favorite.find({ userId: req.user.userId }).populate(
      "propertyId"
    );
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(favorites));
    res.json(favorites);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const removeFavorite = async (req, res) => {
  const { id } = req.params;
  try {
    await Favorite.findOneAndDelete({ _id: id, userId: req.user.userId });
    await redisClient.del(`favorites:${req.user.userId}`);
    res.json({
      success: true,
      message: "Favorite removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite };
