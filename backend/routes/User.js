var express = require("express");
const mongoose=require('mongoose');
const Users = require("../models/User");
var router = express.Router();
const jwt = require('jsonwebtoken');
const {
    body,
    validationResult
} = require("express-validator");
var GeneratePassword = require("../common/password");


router.post(
    "/create",
    [
        body(
            "name",
            "Name Cannot be Blank or Cannot be Less than 3 character"
        ).isLength({
            min: 3
        }),
        body("email", "Email Cannot Be Blank and Provide Correct Email").isEmail(),
        body("phoneNumber").isLength({
            min: 10
        }),
    ],
    async (req, res) => {

        const {
            name,
            email,
            Gender,
            UserBio,
            phoneNumber,
            UserType
        } = req.body;
        try {
            console.log(req.body)
            const _error = validationResult(req);
            if (!_error.isEmpty()) {
                console.log(_error.array());
                res
                    .status(200)
                    .json({
                        message: '0:'+_error.array().map((x) => x.path + " " + x.msg).join(' ')
                    });
            } else {
                let MakePassWordHas = req.body.password;
                let Object = await GeneratePassword({
                    Password: MakePassWordHas,
                    Message: "1:",
                });
                if (Object.Message.includes("0:")) {
                    res.json({
                        message: "something Went Wrong Try Again Later"
                    });
                    return;
                } else {
                    MakePassWordHas = Object.Password;
                }
                let _Date = Date.now();
                const newUser = new Users({
                    name: name,
                    email: email,
                    password: MakePassWordHas,
                    gender: Gender,
                    UserBio: UserBio,
                    createdAt: _Date,
                    phoneNumber: phoneNumber,
                    UserType:UserType,
                });

                newUser.save().then(
                    (result) => {
                        res.status(201).json({message:'1:Registration Success'});
                    },
                    (err) => {
                        if (err.code === 11000) {
                            // Duplicate key error
                            console.log(Object.keys(err.keyPattern));
                            const field = Object.keys(err.keyPattern)[0]; // Get the field that caused the error
                            res
                                .status(200)
                                .json({
                                    message: `The ${field} is already in use.`
                                });
                        } else {
                            res.status(200).json({
                                message: err.message
                            });
                        }
                    }
                );
            }
        } catch (err) {
            if (err.code === 11000) {
                // Duplicate key error
                const field = Object.keys(err.keyPattern)[0]; // Get the field that caused the error
                res.status(200).json({
                    message: `The ${field} is already in use.`
                });
            } else {
                res.status(200).json({
                    message: err.message
                });
            }
        }
    }
);

router.get("/get", async (req, res) => {
    try {
        const _user = await Users.find({}, {
            name: 1,
            email: 1,
            UserBio: 1,
            phoneNumber: 1
        });
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
        const _user = await Users.find({
            _id:(new mongoose.Types.ObjectId( req.params.id))
        }, {
            name: 1,
            email: 1,
            UserBio: 1,
            phoneNumber: 1,
            gender:1,UserType:1
        });
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
            Gender,
            UserBio,
            phoneNumber
        } = req.body;
        try {
            const _error = validationResult(req);
            if (!_error.isEmpty()) {
                console.log(_error.array());
                res
                    .status(200)
                    .json({
                        error: _error.array().map((x) => x.path + " " + x.msg)
                    });
            } else {
                const _userexist = await Users.find({
                    email: email
                }, {
                    _id: 1,
                    email: 1
                });
                console.log(_userexist);
                if (_userexist) {
                    const newUser = new Users({
                        name: name,
                        email: email,
                        gender: Gender,
                        UserBio: UserBio,
                        phoneNumber: phoneNumber,
                    });

                    console.log(_userexist[0].email);
                    newUser
                        .findOneUpdate({
                            email: _userexist[0]["email"]
                        }, {
                            $set: {
                                name: req.body.name,
                                UserBio: req.body.UserBio,
                            },
                        })
                        .then((result) => {
                            res.status(201).json(result);
                        })
                        .catch((err) => {
                            res.status(200).json({
                                message: err.message
                            });
                        });
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