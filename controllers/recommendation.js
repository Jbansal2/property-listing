const Recommendation = require('../models/Recommendation'); 
const { redisClient } = require('../config/redis');
const User = require('../models/User');

const recommendProperty = async (req, res) => {
  const { propertyId, recipientEmail } = req.body;
  console.log('Received recommendation request:', req.body);

  if (!propertyId || !recipientEmail) {
    return res.status(400).json({ message: 'Missing propertyId or recipientEmail' });
  }

  try {
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    console.log('Found recipient:', recipient);

    const recommendation = new Recommendation({
      senderId: req.user.userId, 
      recipientId: recipient._id,
      propertyId,
    });

    await recommendation.save();
    await redisClient.del(`recommendations:${recipient._id}`);

    res.status(201).json(recommendation);
  } catch (error) {
    console.error('Error in recommendProperty:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message, 
    });
  }
};

const getRecommendations = async (req, res) => {
  const cacheKey = `recommendations:${req.user.userId}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const recommendations = await Recommendation.find({
      recipientId: req.user.userId,
    })
      .populate('senderId', 'name email')
      .populate('propertyId');

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(recommendations));
    res.json(recommendations);
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message, 
    });
  }
};

module.exports = { recommendProperty, getRecommendations };