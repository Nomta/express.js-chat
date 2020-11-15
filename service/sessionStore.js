var session = require("express-session");
var mongoose = require("../service/connection");
var MongoStore = require("connect-mongo")(session);

var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
module.exports = sessionStore;
