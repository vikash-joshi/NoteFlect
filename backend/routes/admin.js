var express = require("express");
const mongoose = require("mongoose");
const Users = require("../models/User");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
var GeneratePassword = require("../common/password");
const authenticateToken = require("../middleware/fetchuser");

router.get("/getUsers", authenticateToken, async (req, res) => {
  try {
    const _user = await Users.find(
      {},
      {
        name: 1,
        email: 1,
        gender: 1,
        IsEmailVerified: 1,
        UserType: 1,
        IsAccountLocked: 1,
        createdAt: 1
      }
    );
    if (_user) {
      res.json(_user);
    } else {
      res.status(200).json({
        message: "0:Data Not Found"
      });
    }
  } catch (ex) {
    res.json({
      message: "0:" + ex.message
    });
  }
});

router.get("/getuser/:id", async (req, res) => {
  try {
    console.log(req.query);
    console.log(req.params.id);
    const _user = await Users.find(
      {
        _id: new mongoose.Types.ObjectId(req.params.id)
      },
      {
        name: 1,
        email: 1,
        UserBio: 1,
        phoneNumber: 1,
        gender: 1,
        UserType: 1
      }
    );
    console.log(_user);
    if (_user) {
      res.json(_user);
    } else {
      res.status(200).json({
        message: "0:Data Not Found"
      });
    }
  } catch (ex) {
    res.json({
      message: "0:" + ex.message
    });
  }
});

router.post(
  "/update",
  [
    body(
      "name",
      "Name Cannot be Blank or Cannot be Less than 3 character"
    ).isLength({
      min: 3
    }),
    body("email", "Email Cannot Be Blank and Provide Correct Email").isEmail(),
    
  ],
  async (req, res) => {
    const {
      name,
      email,
      IsAccountLocked,
      IsEmailVerified,
      UserType,
      _id
    } = req.body;
    try {
      const _error = validationResult(req);
      if (!_error.isEmpty()) {
        console.log(_error.array());
        res.status(200).json({
          message:
            "0:" +
            _error
              .array()
              .map((x) => x.path + " " + x.msg)
              .join(" ")
        });
      } else {
        const _userexist = await Users.find(
          {
            email: email
          },
          {
            _id: 1,
            email: 1
          }
        );
        console.log({
            name: name,
            IsAccountLocked: IsAccountLocked,
            IsEmailVerified: IsEmailVerified,
            UserType: UserType
          });
        if (_userexist) {
          let result=await Users.updateOne(
              {
                _id: new mongoose.Types.ObjectId(_id)
              },
              {
                $set: {
                  name: name,
                  IsAccountLocked: IsAccountLocked,
                  IsEmailVerified: IsEmailVerified,
                  UserType: UserType
                }
              }
            );
            console.log(result)
            res.status(201).json({message:result?.modifiedCount>0 ? '1:Updated Success':'0:Failed to Update'});            
           /* .then((result) => {
              res.status(201).json(result);
            })
            .catch((err) => {
              res.status(200).json({
                message: err.message
              });
            });*/
        }
        /*else{

          
        newUser.save().then(
          (result) => {
            res.status(201).json(result);
          },
          (err) => {
            if (err.code === 11000) {
              // Duplicate key error
              console.log(Object.keys(err.keyPattern));
              const field = Object.keys(err.keyPattern)[0]; // Get the field that caused the error
              res
                .status(200)
                .json({ message: `The ${field} is already in use.` });
            } else {
              res.status(200).json({ message: err.message });
            }
          }
        );
      }
    }*/
      }
    } catch (err) {
      res.status(200).json({
        message: err.message
      });
    }
  }
);

module.exports = router;
