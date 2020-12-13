const mongoose = require("mongoose");
const { mongodb } = require("../config");

mongoose.connect(mongodb.uri);

module.exports = mongoose;
