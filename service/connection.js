var mongoose = require("mongoose");
var { mongodb } = require("../config");

mongoose.connect(mongodb.uri);

module.exports = mongoose;
