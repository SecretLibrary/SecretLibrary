const paramCheck = params => Object.keys(params).every(key => params[key] !== undefined)

module.exports = {
    paramCheck
}
