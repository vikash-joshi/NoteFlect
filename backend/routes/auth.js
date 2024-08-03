var express = require("express");
const Users = require("../models/User");
const bcrypt = require("bcrypt");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

router.get("/", (req, res) => {
  console.log(req.body);
  res.send("hello from auth");
});

router.get("/verifytoken", (req, res) => {
  const token = process.env.JWT_Value;
  try {
    console.clear();
    console.log("cookie", req.headers.cookie);
    console.log("cookie", req.headers.cookie?.["cookie"]);
    let Cookie = req.headers?.cookie?.split("=")[1];
    jwt.verify(Cookie, token, (err, decoded) => {
      if (decoded) {
        console.log(decoded); // bar2
        if (decoded?.IsAccountLocked) {
          //throw {message:'Account Locked Kindly Contact Admin'}
          res
            .status(200)
            .json({ data: { message: "Account Locked Kindly Contact Admin" } });
        } else {
          res.json(decoded);
        }
      } else {
        throw err;
      }
    });
  } catch (ex) {
    res.status(200).json({ message: ex.message });
  }
});

router.post(
  "/VerifyUser",
  [
    body("email", "Valid email").isEmail(),
    body("password", "password cannot be blank").exists()
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      const _error = validationResult(req);

      console.log(_error);
      if (!_error.isEmpty()) {
        console.log(_error.array());
        res.status(400).json({
          error: _error.array().map((x) => x.path + " " + x.msg)
        });
      } else {
        const _userExist = await Users.findOne({ email });
        if (!_userExist) {
          res.status(200).json({
            message: "please provide valid criendtials"
          });
        } else {
          const IsMatch = await bcrypt.compare(password, _userExist.password);
          if (!IsMatch) {
            res.status(200).json({
              message: "please provide valid criendtials"
            });
          } else {
            console.log(_userExist);
            if (_userExist.IsAccountLocked) {
              //throw {message:'Account Locked Kindly Contact Admin'}
              res
                .status(200)
                .json({ message: "Account Locked Kindly Contact Admin" });
            } 
            else {
              const token = jwt.sign(
                {
                  name: req.body.name,
                  email: req.body.email,
                  id: _userExist._id,
                  UserType: _userExist.UserType,
                  IsAccountLocked: _userExist.IsAccountLocked
                },
                process.env.JWT_Value
              );

              res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "Strict",
                maxAge: 100000 * 60 * 1
              }); // Set secure: true in production

              res.status(200).json({ success: true });
            }
          }
        }
      }
    } catch (ex) {
      res.status(200).json({
        message: ex.message
      });
    }
  }
);

module.exports = router;
