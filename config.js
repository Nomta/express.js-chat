var config = {
    mongodb: {
        uri: 'mongodb://localhost/chat'
    },
    session: {
        secret: '123',
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: null
        }
    }
}

module.exports = config