const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, 
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Apartment", "House", "Condo", "Villa", "Townhouse", "Bungalow"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  areaSqFt: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
    default: [],
  },
  furnished: {
    type: String,
    enum: ["Furnished", "Unfurnished", "Semi-furnished"],
    required: true,
  },
  availableFrom: {
    type: Date,
    required: false,
  },
  listedBy: {
    type: String,
    enum: ["Builder", "Owner", "Agent"],
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  colorTheme: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
    min: 0,
    max: 5,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  listingType: {
    type: String,
    enum: ["sale", "rent"],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Property", propertySchema);