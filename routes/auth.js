const router = require("express").Router();
const { register, login, logout } = require("../controllers/authController");
// register user

router.post("/register", register);

//login user

router.post("/login", login);

router.put("/logout", logout);

module.exports = router;
