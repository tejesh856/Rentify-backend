const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const { validatecreateuser } = require("../Middleware/validate");
router.post(
  "/createuser",
  [
    body("firstname")
      .notEmpty()
      .withMessage("firstname is required.")
      .isLength({ min: 3 })
      .withMessage("firstname must be atleast 3 characters long")
      .trim(),
    body("lastname")
      .notEmpty()
      .withMessage("lastname is required.")
      .isLength({ min: 3 })
      .withMessage("lastname must be atleast 3 characters long")
      .trim(),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
    body("phone")
      .notEmpty()
      .withMessage("phone number is required")
      .isNumeric()
      .withMessage("Phone number must be numberic")
      .isMobilePhone()
      .withMessage("Phone number is invalid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .trim(),
  ],
  validatecreateuser,
  async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    let secpassword = await bcrypt.hash(req.body.password, salt);
    const userExists = await user.findOne({
      email: req.body.email,
      phone: req.body.phone,
    });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: { usercreation: ["User already exist. Please Login"] },
      });
    }
    const emailExists = await user.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: { email: ["Email already exists."] },
      });
    }
    const phoneExists = await user.findOne({ phone: req.body.phone });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: { email: ["Phone already exists."] },
      });
    }
    await user
      .create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        password: secpassword,
      })
      .then(() => {
        res.status(201).json({
          success: true,
          message: { usercreation: ["you created account successfully"] },
        });
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          message: { servererror: ["Internal Server Error"] },
        });
      });
  }
);
module.exports = router;
