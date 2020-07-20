const response = require('../routes/utils/response')
const isCompleteAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.registered) {
            return next()
        }
        return response.failed(res, { message: 'Not registered yet', status: 403 })
    }
    return response.failed(res, { message: 'Not authorized', status: 401 })
}

const isIncompleteAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (!req.user.registered) {
            return next()
        }
        return response.failed(res, { message: 'Not registered yet', status: 403 })
    }
    return response.failed(res, { message: 'Not authorized', status: 401 })
}

const isAdmin = function (req, res, next) {
    if (req.user && req.user.cLevel > 3) {
        return next()
    } else {
        return response.failed(res, { message: 'Not granted', status: 403 })
    }
}

module.exports = {
    isCompleteAuthenticated,
    isIncompleteAuthenticated,
    isAdmin
}
