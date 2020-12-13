const session = require("express-session");
const mongoose = require("../service/connection");
const MongoStore = require("connect-mongo")(session);

const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection
});
module.exports = sessionStore;
