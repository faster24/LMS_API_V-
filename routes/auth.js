const router = require("express").Router();
const { body } = require("express-validator");
const { register , login , logout } = require('../controllers/authController');
// register user

router.post(
  "/register",
  body("email").custom((value) => {
    return User.find({
      email: value,
    }).then((user) => {
      if (user.length > 0) {
        return Promise.reject("Email is already in use.");
      }
    });
  }),
  body("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must have at least 6 characters"),
  register
);

//login user

router.post("/login", login );

router.put("/logout", logout);


module.exports = router;
