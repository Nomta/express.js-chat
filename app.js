const express = require("express");
const session = require("express-session");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const path = require("path");
const logger = require("morgan");
const HttpError = require("./error/HttpError");
const store = require("./service/sessionStore");

const sessionConfig = Object.assign({}, require("./config").session, { store });

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.engine("ejs", require("ejs-locals"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, "public")));
app.use(require("./middleware/getUser"));
app.use(require("./middleware/sendHttpError"));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    if (err.status === 401) {
        res.redirect("/login");
    }
    if (req.app.get("env") === "development") {
        if (err instanceof HttpError) {
            return res.sendHttpError(err);
        }
        res.locals.message = err.message;
        res.locals.error = err;
    } else {
        res.locals.message = "Internal server error";
        res.locals.error = {};
    }
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
