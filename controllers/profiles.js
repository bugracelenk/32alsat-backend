const mongoose = require("mongoose");

exports.get_profile = (req, res, next) => {
  const profile_id = req.userData.profile_id;

  mongoose
    .model("Profile")
    .findOne({ _id: profile_id })
    .select("-__v -user_id")
    .populate("user_id", "-__v, -password -profile_id")
    .populate("followers", "-__v -user_id")
    .populate("followed", "-__v -user_id")
    .populate("engellenen_kullanicilar", "-__v -user_id")
    .exec()
    .then(profile => {
      if(profile) {
        if(profile.isHidden) {
          return res.status(200).json({
            name: profile.name,
            surname: profile.surname,
            profile_type: profile.profile_type,
            ilanlar: profile.ilanlar,
            followers: profile.followers,
            followed: profile.followed,
            email: profile.email
          });
        }else { return res.status(200).json(profile)}
      }else {
        return res.status(404).json({
          err: "Profil bulunamadı."
        })
      }
    }).catch(err => {
      console.log(err);
      return res.status(500).json({
        err
      })
    })
};
