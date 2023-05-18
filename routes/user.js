const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../models/User");

// Request body params for signup example
// {
//   "username": "random username"
//   "email": "valid email",
//   "password": "valid password"
// }
router.post(
  "/signup",
  [
    check("username", "Please Enter a Valid Username")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      // console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

// Request body params for login example
// {
//   "email": "valid email",
//   "password": "valid password"
// }

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    // console.log(req)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !",
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (e) {
      // console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

// To get the user details place the token after getting response from the login details in the header params
router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user._id);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

// To get the all resgistered users
router.get("/all-users", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const users = await User.find().exec();
    res.json(users);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

router.put("/:userID", async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);
    console.log(req.params.userID, "===req");
    console.log(user, "===user");
    user.set(req.body);
    const result = await user.save();
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});


// To delete resgistered user
router.delete("/:userID", async (req, res) => {
  console.log(req.params.userID)
  try {
    // request.user is getting fetched from Middleware after token authentication
    const deleteUser = await User.deleteOne({ _id: req.params.userID });
    res.json(deleteUser);
  } catch (e) {
    res.send({ message: "Error in Deleting user" });
  }
});

module.exports = router;
