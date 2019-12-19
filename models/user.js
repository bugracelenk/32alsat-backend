const mongoose = require("mongoose");

const user = mongoose.model("User", new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  },
  password: {
    type: String,
    required: true
  },
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true
  }
}));

module.exports = user;