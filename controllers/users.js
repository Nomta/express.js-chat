var User = require("../models/user");
var { HttpError, AuthError } = require("../error");
const { isValidObjectId } = require("mongoose");

exports.get = function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) return next(err);
        res.json(users);
    });
};

exports.getById = function (req, res, next) {
    if (!isValidObjectId(req.params.id)) {
        return next(new HttpError(404, "User not found"));
    }

    User.findById(req.params.id, function (err, user) {
        if (err) return next(err);
        if (!user) {
            return next(new HttpError(404, "User not found"));
        }
        res.json(user);
    });
};
