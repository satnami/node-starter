var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    multer = require('multer'),
    Users = require("../models/Users"),
    authToken = require('../security/authToken');


var upload = multer({
    storage: multer.diskStorage({
        destination: 'public/uploads/',
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                if (err) return cb(err);
                cb(null, raw.toString('hex') + path.extname(file.originalname));
            })
        }
    })
});

var usersApi = {
    get: function (req, res) {
        Users.GetUsers(function (err, data) {
            if (err) res.status(500).json({success: false, message: 'Something blew up!'});
            else res.status(200).json({success: true, message: data});
        })
    }
};

var authApi = {
    create: function (req, res) {
        var user = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email || "",
            name: req.body.name || ""
        };
        Users.CreateUser(user, function (err, data) {
            if (err) res.status(500).json({success: false, message: 'Something blew up!'});
            else res.status(200).json({success: true, message: data});
        });
    },
    login: function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        Users.findOne({username: username}).select('password').exec(function (err, user) {
            if (err) throw err;

            if (!user) {
                res.status(401).json({success: false, message: 'User Not Exist'});
            }
            else if (user) {
                var validPass = Users.VerifyPassword(password, user);
                if (!validPass) res.status(401).json({success: false, message: 'Invalid Password'});
                else {
                    //token generator
                    var token = authToken.createToken(user);
                    res.status(200).json({
                        success: true,
                        message: "Successfully Login!",
                        token: token
                    });
                }
            }
        })
    }
};

var viewsApi = {
    index: function (req, res) {
        res.redirect("/apps/index.html");
    }
};

var errorApi = {
    error: function (err, req, res, next) {
        if (err) {
            var error = err.message || err;
            res.status(500).json({success: false, message: error});
        }
    }
};

var uploadApi = {
    imageUpload: function (req, res) {
        upload.single('file')(req, res, function (err) {
            if (err) {
                console.log(err.message);
                res.status(500).json({success: false, message: 'Something blew up!'});
                return
            }
            var response = {files: req.files, file: req.file, body: req.body};
            res.status(500).json({success: true, message: response});
        })
    }
};

module.exports = {
    users: usersApi,
    error: errorApi,
    views: viewsApi,
    upload: uploadApi,
    auth: authApi
};