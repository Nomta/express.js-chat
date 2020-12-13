const mongoose = require("../service/connection");
const User = require("../models/user");

mongoose.connection.on("open", async function () {
    await User.deleteMany();

    if (err) throw err;

    await User.create({
        username: "123",
        password: "123"
    });

    mongoose.disconnect();
});
