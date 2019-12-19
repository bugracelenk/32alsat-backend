const mongoose = require("mongoose");

const profile = mongoose.model("Profile", new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  birth_date: {
    type: Date,
    default: Date.now()
  },
  profile_type: {
    type: String,
    enum: ["magaza", "normal"],
    default: "normal"
  },
  ilanlar: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ilan",
    required: true
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    default: []
  }],
  followed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    default: []
  }],
  begendigi_ilanlar: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ilan",
    default: []
  }],
  adres: {
    sehir: {
      type: String,
      required: true
    },
    acik_adres: {
      type: String,
      required: true
    }
  },
  engellenen_kullanicilar: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    default: []
  }],
  telefon_no: {
    type: Number,
    required: true
  }
}));

module.exports = profile;