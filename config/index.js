const config = {
    mongodb: {
        uri: "mongodb://localhost/chat"
    },
    session: {
        secret: "123",
        key: "123",
        cookie: {
            path: "/",
            httpOnly: true,
            maxAge: null
        }
    },
    crypto: {
        length: 31
    }
};

module.exports = config;
