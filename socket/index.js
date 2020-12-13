const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const config = require("../config");
const store = require("../service/sessionStore");
const User = require("../models/user");
const AuthError = require("../error/AuthError");
const HttpError = require("../error/HttpError");
const log = require("../service/log").bind(null, "chat");

module.exports = function (server) {
    const io = require("socket.io")(server);

    io.use(async function (socket, next) {
        const handshake = socket.request;
        handshake.cookies = cookie.parse(handshake.headers.cookie || "");

        const sidCookie = handshake.cookies[config.session.key];
        const sid = cookieParser.signedCookie(sidCookie, config.session.secret);

        if (!sid) {
            next(new AuthError("Not authorized"));
        }

        try {
            const session = await getSession(sid);

            if (!session) {
                next(new HttpError(401, "No session"));
            }

            handshake.session = session;

            if (!session.user) {
                next(new HttpError(403, "Anonymous session"));
            }
            const user = await User.findById(session.user);

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
        const username = socket.handshake.user.username;

        socket.broadcast.emit("join", { username });
        log(`${username} is connected`);

        socket.on("message", function ({ message }) {
            const data = { username, message };

            socket.broadcast.emit("push", data);
            socket.emit("push", { owner: true, ...data });
            log(`${username}: ${message}`);
        });

        socket.on("disconnect", function () {
            socket.broadcast.emit("leave", { username });
            log(`${username} is disconnected`);
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
