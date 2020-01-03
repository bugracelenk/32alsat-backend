const mongoose = require("mongoose");

const tag = mongoose.model("Tag", new mongoose.Schema({
  tag_name: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    default: []
  },
  ilanlar: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Ilan",
    default: []
  }
}));

module.exports = tag;