const User = require("../models/user");
const HttpError = require("../error/HttpError");
const AuthError = require("../error/AuthError");

exports.get = function (req, res, next) {
    res.render("login", { title: "Login" });
};

exports.post = async function (req, res, next) {
    const { username, password } = req.body;

    try {
        const user = await User.authorize(username, password);
        req.session.user = user._id;
        res.send(200);
    } catch (err) {
        if (err instanceof AuthError) {
            return next(new HttpError(403, err.message));
        }
        return next(err);
    }
};
