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
  ilanlar: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ilan",
    default: []
  }],
  urunler: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Urun",
    default: []
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    default: []
  }],
  following: [{
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
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  store_name: {
    type: String
  }
}));

module.exports = profile;