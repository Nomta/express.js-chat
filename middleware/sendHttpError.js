module.exports = function(req, res, next) {
    var isAjax = res.req.xhr || res.req.headers['x-requested-with'] == 'XMLHttpRequest'

    res.sendHttpError = function(error) {
        res.status(error.status)
        
        if (isAjax) {
            res.json(error)
        }
        else {
            res.render('error', { error, message: error.message })
        }
    }
    next()
}