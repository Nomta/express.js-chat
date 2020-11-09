class AuthError extends Error {
    constructor(message) {
        super()

        this.name = this.constructor.name
        this.message = message || this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AuthError