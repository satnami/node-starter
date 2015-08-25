var mongoose = require("mongoose"),
    bcrypt = require('bcrypt-nodejs');

var UsersSchema = new mongoose.Schema({
    username: {type: String},
    name: {type: String, default: '', trim: true},
    email: {type: String, default: '', trim: true},
    password: {type: String},
    device_key: {type: String}
});

UsersSchema.pre('save', function (callback) {
    var user = this;

    if (!user.isModified('password')) return callback();

    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

var Users = mongoose.model("Users", UsersSchema);

Users.CreateUser = function (obj, callback) {
    var user = new Users(obj);
    user.save(callback);
};

Users.GetUsers = function (callback) {
    Users.find({}).lean().exec(callback);
};

Users.VerifyPassword = function (password, user) {
    return bcrypt.compareSync(password, user.password);
};

module.exports = Users;