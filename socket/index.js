var cookie = require("cookie");
var cookieParser = require("cookie-parser");
var config = require("../config");
var store = require("../service/sessionStore");
var User = require("../models/user");
var AuthError = require("../error/AuthError");
var HttpError = require("../error/HttpError");

module.exports = function (server) {
    var io = require("socket.io")(server);

    io.use(async function (socket, next) {
        var handshake = socket.request;
        handshake.cookies = cookie.parse(handshake.headers.cookie || "");

        var sidCookie = handshake.cookies[config.session.key];
        var sid = cookieParser.signedCookie(sidCookie, config.session.secret);

        if (!sid) {
            next(new AuthError("Not authorized"));
        }

        try {
            var session = await getSession(sid);

            if (!session) {
                next(new HttpError(401, "No session"));
            }

            handshake.session = session;

            if (!session.user) {
                next(new HttpError(403, "Anonymous session"));
            }
            var user = await User.findById(session.user);

            if (!user) {
                next(new HttpError(403, "Anonymous session"));
            }

            handshake.user = user;
            socket.handshake = handshake;

            next();
        } catch (err) {
            next(err);
        }
    });

    io.on("connect", function (socket) {
        var username = socket.handshake.user.username;

        socket.broadcast.emit("join", { username });

        socket.on("message", function ({ message }) {
            var data = { username, message };

            socket.broadcast.emit("push", data);
            socket.emit("push", { owner: true, ...data });
        });

        socket.on("disconnect", function () {
            socket.broadcast.emit("leave", { username });
        });
    });
};

function getSession(sid) {
    return new Promise(function (resolve, reject) {
        store.load(sid, function (err, session) {
            if (session) resolve(session);
            else reject(new HttpError(401, "No session"));
        });
    });
}
