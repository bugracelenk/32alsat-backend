const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

router.post('/login', UsersController.user_login);
router.post('/register', UsersController.user_register);

module.exports = router;