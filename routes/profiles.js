const express = require("express");
const router = express.Router();

const ProfileControllers = require("../controllers/profiles");

router.get('/get-profile', ProfileControllers.get_profile);

module.exports = router;