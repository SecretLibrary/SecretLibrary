
/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const articles = require('./articles')
const articles2 = require('./articles2')
const meetings = require('./meetings')
const user = require('./user')
const places = require('./places')
const questions = require('./questions')
const likey = require('./likey')
const comments = require('./comments')
const attendee = require('./attendee')

module.exports = {
    tables: {
        articles,
        articles2,
        user,
        meetings,
        places,
        questions,
        likey,
        comments,
        attendee
    }
}
