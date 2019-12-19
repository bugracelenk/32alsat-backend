const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.user_login = (req, res, next) => {
  mongoose
    .model("User")
    .findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user)
        return res.status(401).json({
          message: "Giriş Başarısız"
        });

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err)
          return res.status(401).json({
            message: "Giriş Başarısız"
          });
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              _id: user._id,
              profile_id: user.profile_id
            },
            "secret",
            {
              expiresIn: '1h'
            }
          );

          return res.status(200).json({
            message: "Giriş Başarılı",
            token
          })
        }
        return res.status(401).json({
          message: "Giriş Başarısız"
        });
      });
    }).catch(err => {
      console.log(err);
      return res.status(500).json({
        err,
        message: "Admin ile iletişime geç"
      });
    });
};
