const crypto = require("crypto");
const config = require("../config");
const mongoose = require("../service/connection");
const AuthError = require("../error/AuthError");

const schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
};

schema.statics.generateSalt = function () {
    return new Promise(function (resolve, reject) {
        crypto.randomBytes(config.crypto.length, function (err, buffer) {
            if (err) reject(err);
            resolve(buffer.toString("hex"));
        });
    });
};

schema
    .virtual("password")
    .set(async function (password) {
        this._plainPassword = password;
        this.passwordHash = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.passwordHash;
};

schema.statics.authorize = async function (username, password) {
    if (!username || !password) {
        throw new AuthError("Uncorrect data");
    }

    const User = this;

    try {
        const user = await User.findOne({ username });

        if (user) {
            if (user.checkPassword(password)) {
                return user;
            } else {
                throw new AuthError("Uncorrect password");
            }
        } else {
            const salt = await User.generateSalt();
            const user = await User.create({ username, salt, password });
            return user;
        }
    } catch (err) {
        throw err;
    }
};

module.exports = mongoose.model("User", schema);
