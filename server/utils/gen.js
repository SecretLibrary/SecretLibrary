const uuid = require('uuid')
const moment = require('moment')

function generateKey (length = 36) {
    return uuid.v4().split('-').join('').slice(0, length)
}

function generateISOString (time = new Date()) {
    return moment(time).toISOString()
}

function generateRangeDate (targetDate = undefined, amount = 1, unit = 'month') {
    if (!targetDate) {
        targetDate = moment()
    }

    const startDate = moment(targetDate).startOf(unit).subtract(amount, unit).toISOString()
    const endDate = moment(targetDate).endOf(unit).toISOString()

    return {
        startDate, endDate
    }
}

module.exports = {
    generateKey,
    generateISOString,
    generateRangeDate
}
