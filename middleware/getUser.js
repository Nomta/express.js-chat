var User = require('../models/user')

module.exports = async function(req, res, next) {
    req.user = res.locals.user = null

    if (!req.session.user) {
        return next()
    }
    try {
        var user = await User.findById(req.session.user)
        req.user = res.locals.user = user
        next()
    }
    catch(err) {
        next(err)
    }
}