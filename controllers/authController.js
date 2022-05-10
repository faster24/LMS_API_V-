const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const register = async ( req  , res ) => {
    const user = req.body;

    //to create admin account 
    if( user.email === 'admin@gmail.com')
    {
      const newUser = new User({
        firstname: user.firstname,
        lastname: user.lastname,
        username: `${user.firstname} ${user.lastname}`,
        email: user.email,
        password: CryptoJS.AES.encrypt(
          user.password,
          process.env.SECRET_KEY
        ).toString(),
        isAdmin: true
      });
  
      try {
        const savedUser = await newUser.save();
        res.status(200).json({ message: "Account has successfully created!" });
      } catch (error) {
        res.json(error);
      }
    }
    else
    {
      const newUser = new User({
        firstname: user.firstname,
        lastname: user.lastname,
        username: `${user.firstname} ${user.lastname}`,
        email: user.email,
        password: CryptoJS.AES.encrypt(
          user.password,
          process.env.SECRET_KEY
        ).toString(),
      });
  
      try {
        const savedUser = await newUser.save();
        res.status(200).json({ message: "Account has successfully created!" });
      } catch (error) {
        res.status(500).json(error);
      }
    }

}

 const login = async ( req , res ) => {
    const request = req.body;

    try {
      const user = await User.findOne({ email: request.email });
  
      const hash = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
      const password = hash.toString(CryptoJS.enc.Utf8);
  
      if (!user || password !== request.password) {
        res.status(401).json("Wrong credentials!");
      } else {
        const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.SECRET_KEY,
          { expiresIn: "7d" }
        );
  
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      console.log(error);
    }
}

 const logout = async ( req , res ) => {
    const authHeader = req.headers["authorization"];

    jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
      if (logout) {
        res.status(200).json({ msg: "You have been Logged Out" });
      } else {
        res.status(200).json({ msg: "Error" });
      }
    });
}

module.exports = { register , login , logout }