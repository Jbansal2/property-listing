const Property = require("../models/Property");
const { redisClient } = require("../config/redis");

const clearPropertyCache = async () => {
  try {
    const keys = await redisClient.keys("properties:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log("Property cache cleared");
    }
  } catch (err) {
    console.error("Error clearing Redis cache:", err.message);
  }
};

const createProperty = async (req, res) => {
  try {
    const { id, title, price, city, state } = req.body; 
    if (!id || !title || !price || (!city && !state)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingProperty = await Property.findOne({ id });
    if (existingProperty) {
      return res.status(400).json({
        success: false,
        message: "Property ID already exists",
      });
    }

    const newProperty = new Property({
      ...req.body,
      createdBy: req.user.userId,
    });
    await newProperty.save();

    res.status(201).json(newProperty);
  } catch (err) {
    console.error("Create Property Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getProperties = async (req, res) => {
  console.log("Query Parameters:", req.query);
  const cacheKey = `properties:${JSON.stringify(req.query)}`;

  try {
    const cachedData = await redisClient.get(cacheKey).catch((err) => {
      console.error("Redis get error:", err.message);
      return null;
    });

    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData)) {
          return res.json(parsedData);
        } else {
          console.warn("Invalid cache data");
        }
      } catch (parseError) {
        console.error("Cache parse error:", parseError.message);
      }
    }

    const query = {};
    if (req.query.id) query.id = req.query.id; 
    if (req.query.city) {
      query.$or = [
        { city: new RegExp(req.query.city, "i") },
        { state: new RegExp(req.query.city, "i") },
      ];
    }
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {
        ...(req.query.minPrice && { $gte: +req.query.minPrice }),
        ...(req.query.maxPrice && { $lte: +req.query.maxPrice }),
      };
    }
    if (req.query.bedrooms) query.bedrooms = +req.query.bedrooms;
    if (req.query.bathrooms) query.bathrooms = +req.query.bathrooms;
    if (req.query.minArea || req.query.maxArea) {
      query.areaSqFt = {
        ...(req.query.minArea && { $gte: +req.query.minArea }),
        ...(req.query.maxArea && { $lte: +req.query.maxArea }),
      };
    }
    if (req.query.type) query.type = req.query.type;
    if (req.query.listingType) query.listingType = req.query.listingType;

    const properties = await Property.find(query)
      .populate("createdBy", "name email")
      .lean();

    if (properties.length > 0) {
      await redisClient.set(cacheKey, JSON.stringify(properties), "EX", 3600);
    } else {
      console.warn("No properties found");
    }

    res.json(properties);
  } catch (err) {
    console.error("Get Properties Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const cacheKey = `property:${req.params.id}`;
    const cachedData = await redisClient.get(cacheKey).catch((err) => {
      console.error("Redis get error:", err.message);
      return null;
    });

    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        return res.json(parsedData);
      } catch (parseError) {
        console.error("Cache parse error:", parseError.message);
      }
    }

    const property = await Property.findOne({ id: req.params.id })
      .populate("createdBy", "name email")
      .lean();
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    await redisClient.set(cacheKey, JSON.stringify(property), "EX", 3600);
    res.json(property);
  } catch (err) {
    console.error("Get Property Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findOne({ id });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.createdBy && property.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updated = await Property.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });

    await redisClient.del(`property:${id}`);
    await clearPropertyCache();
    res.json(updated);
  } catch (err) {
    console.error("Update Property Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findOne({ id });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.createdBy && property.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Property.findOneAndDelete({ id });
    console.log("Property deleted:", id);

    await redisClient.del(`property:${id}`);
    await clearPropertyCache();
    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (err) {
    console.error("Delete Property Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};